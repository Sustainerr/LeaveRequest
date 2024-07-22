import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { DataService } from '../services/data.service';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-emp-someone',
  templateUrl: './add-emp-someone.component.html',
  styleUrls: ['./add-emp-someone.component.scss']
})
export class AddEmpSomeoneComponent implements OnInit {
  private typeCongeUrl = 'https://localhost:7216/api/TypeConges/byRole';
  private congesUrl = 'https://localhost:7216/api/conges';
  userRole: string = '';
  leaveTypes: any[] = [];
  leaveForm: FormGroup;
  userGroupId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddEmpSomeoneComponent>,
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.leaveForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      type: ['', Validators.required],
      matricule: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const parsedToken = this.parseToken(token);
      const userId = parsedToken?.nameid;
      if (userId) {
        this.authService.getUserById(userId).subscribe(
          (data) => {
            this.userRole = data.role;
            this.userGroupId = data.groupe_Id; // Assuming the API response contains groupe_Id
            this.getLeaveTypesForRoles(this.userRole);
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

  parseToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  getLeaveTypesForRoles(role: string) {
    this.getLeaveTypesByRole('utilisateur').pipe(
      switchMap((utilisateurTypes) => {
        this.leaveTypes = utilisateurTypes;
        if (role === 'Chef') {
          return this.getLeaveTypesByRole('Chef');
        } else if (role === 'Admin') {
          return this.getLeaveTypesByRole('Chef').pipe(
            switchMap((chefTypes) => {
              this.leaveTypes = this.leaveTypes.concat(chefTypes);
              return this.getLeaveTypesByRole('Admin');
            })
          );
        } else {
          return of([]); // No additional types to fetch
        }
      }),
      catchError((error) => {
        console.error('Error fetching leave types:', error);
        return of([]); // Return an empty array on error
      })
    ).subscribe((additionalTypes) => {
      if (role === 'Chef' || role === 'Admin') {
        this.leaveTypes = this.leaveTypes.concat(additionalTypes);
      }
    });
  }

  getLeaveTypesByRole(role: string) {
    const url = `${this.typeCongeUrl}/${role}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching leave types for role ${role}:`, error);
        return of([]);
      })
    );
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      const token = this.authService.getToken();
      if (token) {
        const parsedToken = this.parseToken(token);
        const userId = parsedToken?.nameid;
        const leaveRequest = {
          date_Debut: this.leaveForm.value.dateDebut,
          date_Fin: this.leaveForm.value.dateFin,
          statut: 'Approved', // Automatically set to Approved
          type_Conge_Id: this.leaveForm.value.type,
          matricule: this.leaveForm.value.matricule // Use the matricule from the form
        };

        if (this.userRole === 'Admin') {
          // Admin can add leave request for any user
          this.submitLeaveRequest(leaveRequest);
        } else if (this.userRole === 'Chef') {
          if (this.userGroupId !== undefined) {
            this.dataService.getUserByMatricule(this.leaveForm.value.matricule).subscribe(
              (data) => {
                if (data.groupe_Id === this.userGroupId) {
                  this.submitLeaveRequest(leaveRequest);
                } else {
                  console.error('Error: The selected user is not in the same group.');
                  // Display error message to the user
                }
              },
              (error) => {
                console.error('Error fetching user data by matricule:', error);
              }
            );
          } else {
            console.error('Error: Group ID is undefined.');
            // Display error message to the user
          }
        }
      } else {
        console.error('Token is not available.');
      }
    } else {
      console.error('Form is invalid.');
    }
  }

  submitLeaveRequest(leaveRequest: any) {
    this.http.post(this.congesUrl, leaveRequest).subscribe(
      (response) => {
        this.snackBar.open(`A request has been added for the user with matricule: ${leaveRequest.matricule}`, 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(); // Close the dialog after successful submission
      },
      (error) => {
        console.error('Error submitting leave request:', error);
        // Optionally: Display error message to the user
      }
    );
  }
}
