import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/data.service';
import { AuthService } from '../auth.service';
import { AddEmpComponent } from '../add-emp/add-emp.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AddEmpSomeoneComponent } from 'app/add-emp-someone/add-emp-someone.component';

export interface PeriodicElement {
  conge_Id: number;
  date_Debut: Date;
  date_Fin: string;
  statut: string;
  days: number;
  type: string;
  name: string;
  matricule: number; // Add matricule to the interface
}

@Component({
  selector: 'app-table-paginator-chef',
  templateUrl: './table-paginator-chef.component.html',
  styleUrls: ['./table-paginator-chef.component.scss']
})
export class TablePaginatorChefComponent implements OnInit {
  displayedColumns: string[] = ['name', 'date_Debut', 'date_Fin', 'statut', 'days', 'type', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private _dialog: MatDialog,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const token = this.authService.getToken();
    if (token) {
      const parsedToken = this.parseToken(token);
      const userId = parsedToken?.nameid;
      if (userId) {
        this.authService.getUserById(userId).subscribe(
          (userData) => {
            const role = userData.role;
            const groupeId = userData.groupe_Id;
            if (role === 'Admin') {
              this.fetchAllPendingLeaves();
            } else if (groupeId) {
              this.fetchPendingLeavesAndGroupMembers(groupeId);
            } else {
              console.error('groupeId is undefined.');
            }
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      } else {
        console.error('userId is undefined.');
      }
    } else {
      console.error('Token is not available.');
    }
  }

  fetchAllPendingLeaves() {
    forkJoin({
      pendingLeaves: this.dataService.getLeavesByStatus('Pending'),
      members: this.dataService.getAllMembers()
    }).subscribe(
      ({ pendingLeaves, members }) => {
        const leavesWithNames = pendingLeaves.map(leave => {
          const member = members.find(member => member.matricule === leave.matricule);
          return {
            ...leave,
            name: member ? `${member.prenom} ${member.nom}` : 'Unknown',
            matricule: leave.matricule // Add matricule to each leave
          };
        });
        this.processLeaveData(leavesWithNames);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  fetchPendingLeavesAndGroupMembers(groupeId: number) {
    forkJoin({
      members: this.dataService.getGroupMembers(groupeId),
      pendingLeaves: this.dataService.getLeavesByStatus('Pending')
    }).subscribe(
      ({ members, pendingLeaves }) => {
        const leavesWithNames = pendingLeaves.map(leave => {
          const member = members.find(member => member.matricule === leave.matricule);
          return {
            ...leave,
            name: member ? `${member.prenom} ${member.nom}` : 'Unknown',
            matricule: leave.matricule // Add matricule to each leave
          };
        });
        this.processLeaveData(leavesWithNames);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  processLeaveData(leaves: any[]) {
    this.dataService.getTypeConges().subscribe(
      (typeCongesData) => {
        const processedData = leaves.map(leave => {
          const typeConge = typeCongesData.find(tc => tc.type_Conge_Id === leave.type_Conge_Id);
          return {
            conge_Id: leave.conge_Id,
            date_Debut: leave.date_Debut,
            date_Fin: leave.date_Fin,
            statut: leave.statut,
            days: this.calculateDays(new Date(leave.date_Debut), new Date(leave.date_Fin)),
            type: typeConge ? typeConge.type : 'Unknown',
            name: leave.name,
            matricule: leave.matricule // Add matricule to processed data
          };
        });

        this.dataSource = new MatTableDataSource(processedData);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching type conge data:', error);
      }
    );
  }

  parseToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  calculateDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((endDate.getTime() - startDate.getTime()) / oneDay);
  }

  approve(element: PeriodicElement) {
    if (element.conge_Id) {
      this.dataService.updateCongeStatut(element.conge_Id, 'Approved').subscribe(
        (response) => {
          element.statut = 'Approved';
          this.dataSource.data = this.dataSource.data.filter(el => el.conge_Id !== element.conge_Id);
          this.snackBar.open(`The request has been approved for the user with matricule: ${element.matricule}`, 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error approving leave request:', error);
        }
      );
    } else {
      console.error('conge_Id is undefined.');
    }
  }

  deny(element: PeriodicElement) {
    if (element.conge_Id) {
      this.dataService.updateCongeStatut(element.conge_Id, 'Denied').subscribe(
        (response) => {
          element.statut = 'Denied';
          this.dataSource.data = this.dataSource.data.filter(el => el.conge_Id !== element.conge_Id);
          this.snackBar.open(`The request has been denied for the user with matricule: ${element.matricule}`, 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error denying leave request:', error);
        }
      );
    } else {
      console.error('conge_Id is undefined.');
    }
  }

  openAddEmp(event: Event) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this._dialog.open(AddEmpComponent, dialogConfig);
  }

  openAddEmpSomeone(event: Event) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this._dialog.open(AddEmpSomeoneComponent, dialogConfig);
  }
}
