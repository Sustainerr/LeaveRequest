import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddEmpComponent } from '../add-emp/add-emp.component';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userData: any = {};
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private _dialog: MatDialog) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    console.log('Retrieved token:', token);
    if (token) {
      const parsedToken = this.parseToken(token);
      console.log('Parsed token payload:', parsedToken);
      const userId = parsedToken?.nameid;
      console.log('Extracted userId:', userId);
      if (userId) {
        this.authService.getUserById(userId).subscribe(
          (data) => {
            console.log('HTTP response data:', data);
            this.userData = data;
            console.log('User data:', this.userData);
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
      const parsedPayload = JSON.parse(payload);
      console.log('Parsed token payload:', parsedPayload);
      return parsedPayload;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  openaddemp(event: Event) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true; 
    this._dialog.open(AddEmpComponent, dialogConfig);
  }
}
