import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { AuthService } from '../auth.service';
import { AddEmpComponent } from '../add-emp/add-emp.component';
import { ModifyComponent } from '../modify/modify.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';

export interface PeriodicElement {
  conge_Id: number;
  date_Debut: Date;
  date_Fin: Date;
  statut: string;
  days: number;
  type: string;
}

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss']
})
export class TablePaginatorComponent implements OnInit {
  displayedColumns: string[] = ['date_Debut', 'date_Fin', 'statut', 'days', 'type', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  typeCongesData: any[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
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
        this.dataService.getConges(userId).subscribe(
          (congesData) => {
            this.dataService.getTypeConges().subscribe(
              (typeCongesData) => {
                this.typeCongesData = typeCongesData;
                const processedData = congesData.map(item => {
                  const typeConge = typeCongesData.find(tc => tc.type_Conge_Id === item.type_Conge_Id);
                  return {
                    conge_Id: item.conge_Id,
                    ...item,
                    days: this.calculateDays(new Date(item.date_Debut), new Date(item.date_Fin)),
                    type: typeConge ? typeConge.type : 'Unknown'
                  };
                });

                this.dataSource = new MatTableDataSource(processedData);
                this.dataSource.paginator = this.paginator;
              },
              (error) => {
                console.error('Error fetching type conge data:', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching conges data:', error);
          }
        );
      } else {
        console.error('userId is undefined.');
      }
    } else {
      console.error('Token is not available.');
    }
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

  openaddemp(event: Event) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this._dialog.open(AddEmpComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((newEmployee) => {
      if (newEmployee) {
        const typeConge = this.typeCongesData.find(tc => tc.type_Conge_Id === newEmployee.type_Conge_Id);
        const newData = {
          conge_Id: newEmployee.conge_Id,
          date_Debut: new Date(newEmployee.date_Debut),
          date_Fin: new Date(newEmployee.date_Fin),
          statut: newEmployee.statut,
          days: this.calculateDays(new Date(newEmployee.date_Debut), new Date(newEmployee.date_Fin)),
          type: typeConge ? typeConge.type : 'Unknown'
        };
        this.dataSource.data = [...this.dataSource.data, newData];
        this.refreshDataSource();
        this.showSuccessMessage('Request added successfully!');
        this.loadUserData();  // Reload data to ensure consistency
      }
    });
  }

  openadddelete(event: Event) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const dialogRef = this._dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const element = this.dataSource.data.find(el => el.statut === 'Pending');
        if (element) {
          this.delete(element);
        }
      }
    });
  }

  refreshDataSource() {
    this.dataSource.paginator = this.paginator;
  }

  onEditClick(element: PeriodicElement) {
    if (element.statut === 'Pending') {
      this.openmodify(element);
    } else {
      this.showErrorMessage('The leave request cannot be modified.');
    }
  }

  onDeleteClick(element: PeriodicElement) {
    if (element.statut === 'Pending') {
      this.openConfirmDialog('Are you sure you want to delete this request?').afterClosed().subscribe(result => {
        if (result) {
          this.delete(element);
        }
      });
    } else {
      this.showErrorMessage('The leave request cannot be deleted.');
    }
  }

  openConfirmDialog(message: string) {
    return this._dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message }
    });
  }

  openmodify(element: PeriodicElement) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = element;

    const dialogRef = this._dialog.open(ModifyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedDates = {
          date_Debut: this.formatDate(result.dateDebut),
          date_Fin: this.formatDate(result.dateFin)
        };

        this.dataService.updateCongeDates(result.conge_Id, updatedDates).subscribe(
          (response) => {
            console.log('Update response:', response);
            const index = this.dataSource.data.findIndex(item => item.conge_Id === result.conge_Id);
            if (index !== -1) {
              const updatedData = {
                ...this.dataSource.data[index],
                date_Debut: new Date(result.dateDebut),
                date_Fin: new Date(result.dateFin),
                days: this.calculateDays(new Date(result.dateDebut), new Date(result.dateFin)),
              };
              this.dataSource.data[index] = updatedData;
              this.dataSource.data = [...this.dataSource.data];
              this.refreshDataSource();
              this.showSuccessMessage('Request updated!');
            }
          },
          (error) => {
            console.error('Error updating leave request dates:', error);
            this.showErrorMessage('Failed to update the request. Please try again.');
          }
        );
      }
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  delete(element: PeriodicElement) {
    this.dataService.deleteConge(element.conge_Id).subscribe(
      () => {
        this.dataSource.data = this.dataSource.data.filter(item => item.conge_Id !== element.conge_Id);
        this.refreshDataSource();
        this.showSuccessMessage('Request deleted successfully!');
      },
      (error) => {
        console.error('Error deleting leave request:', error);
        this.showErrorMessage('Failed to delete the request. Please try again.');
      }
    );
  }

  showErrorMessage(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  showSuccessMessage(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
