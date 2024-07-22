import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-emp',
  templateUrl: './add-emp.component.html',
  styleUrls: ['./add-emp.component.scss']
})
export class AddEmpComponent implements OnInit {
  private typeCongeUrl = 'https://localhost:7216/api/TypeConges/byRole';
  private congesUrl = 'https://localhost:7216/api/conges';
  userRole: string = '';
  leaveTypes: any[] = [];
  leaveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('AddEmpComponent instantiated');
    this.leaveForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    const token = this.authService.getToken();
    console.log('Token:', token);
    if (token) {
      const parsedToken = this.parseToken(token);
      console.log('Parsed Token:', parsedToken);
      const userId = parsedToken?.nameid;
      console.log('User ID:', userId);
      if (userId) {
        this.authService.getUserById(userId).subscribe(
          (data) => {
            console.log('User data:', data);
            this.userRole = data.role;
            console.log('User Role:', this.userRole);
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
    this.getLeaveTypesByRole('Utilisateur').subscribe(
      (utilisateurTypes) => {
        this.leaveTypes = utilisateurTypes;
        if (role === 'Chef' || role === 'Admin') {
          this.getLeaveTypesByRole('Chef').subscribe(
            (chefTypes) => {
              this.leaveTypes = this.leaveTypes.concat(chefTypes);
              if (role === 'Admin') {
                this.getLeaveTypesByRole('Admin').subscribe(
                  (adminTypes) => {
                    this.leaveTypes = this.leaveTypes.concat(adminTypes);
                  },
                  (error) => {
                    console.error('Error fetching Admin leave types:', error);
                  }
                );
              }
            },
            (error) => {
              console.error('Error fetching Chef leave types:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error fetching Utilisateur leave types:', error);
      }
    );
  }

  getLeaveTypesByRole(role: string) {
    const url = `${this.typeCongeUrl}/${role}`;
    console.log(`Fetching leave types for role: ${role} from URL: ${url}`);
    return this.http.get<any[]>(url);
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
          statut: 'Pending',
          type_Conge_Id: this.leaveForm.value.type,
          matricule: userId
        };
        console.log('Submitting leave request:', leaveRequest);

        this.http.post(this.congesUrl, leaveRequest).subscribe(
          (response) => {
            console.log('Leave request submitted successfully:', response);

            // Display success message and close the dialog
            this._snackBar.open('Request added successfully', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(response);  // Close the dialog
          },
          (error) => {
            console.error('Error submitting leave request:', error);
          }
        );
      } else {
        console.error('Token is not available.');
      }
    } else {
      console.error('Form is invalid.');
    }
  }
}
