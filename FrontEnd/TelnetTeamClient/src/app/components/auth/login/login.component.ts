import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  title = 'Login';
  matricule: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.authService.login(this.matricule, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        this.authService.setToken(response.token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login error:', error);
        this.loginFailed = true;
      }
    );
  }

  isFormValid(): boolean {
    return this.matricule.trim() !== '' && this.password.trim() !== '';
  }
}
