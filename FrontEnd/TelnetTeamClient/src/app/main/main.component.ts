import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  userData: any = {};
  isLoading: boolean = false;
  selectedOption: string = 'manage-requests'; // Default option

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
    this.authService.logout();
  }

  manageRequests(): void {
    this.selectedOption = 'manage-requests';
  }

  approveRejectRequests(): void {
    if (this.userData.role === 'Chef' || this.userData.role === 'Admin') {
      this.selectedOption = 'approve-reject-requests';
    }
  }
}
