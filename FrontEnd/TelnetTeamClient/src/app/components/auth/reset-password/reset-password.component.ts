import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { JwtHelper } from '../../../helpers';
import { NgForm } from '../../../../../node_modules/@angular/forms';
import { AuthenticationService, NotificationService } from '../../../services/shared';
import { UserIdentifiers } from 'app/models/shared';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: []
})
export class ResetPasswordComponent implements OnInit {
  private jwtHelper: JwtHelper = new JwtHelper();

  @ViewChild('f', {static: true}) f: NgForm;
  inputValid = true;
  expired = false;
  newPassword: string;
  newPasswordConfirmed: string;
  barLabel: string = "New Password Strength:";
  passwordStrength = false;
  token: string;
  expires_in: Date;
  userId: string;
  userIdentifiers: UserIdentifiers;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) { }


  ngOnInit() {
    this.userIdentifiers = new UserIdentifiers();
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.expires_in = this.jwtHelper.getTokenExpirationDate(this.token);
      this.userId = this.jwtHelper.getTokenUserId(this.token);
      this.userIdentifiers.identifier = this.userId;
      this.userIdentifiers.token = this.token;
    });
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
    if (this.expires_in < new Date()) {
      this.expired = true;
      this.notificationService.warning('Your reset password is expired , you must send new request');
      this.router.navigate(['/auth/login']);
    } else {
      this.expired = false;
    }
  }

  resetPassword() {
    if (this.newPassword !== null && this.passwordStrength) {
      if (this.newPassword === this.newPasswordConfirmed) {
        this.userIdentifiers.newPassword = this.newPassword;
        this.userIdentifiers.newPasswordConfirmed = this.newPasswordConfirmed;
        this.authService.resetPassword(this.userIdentifiers).subscribe(
          (response) => {
            if (response === 'succeeded') {
              this.notificationService.success('Your password is reseted successfully.');
              this.router.navigate(['/auth/login']);
            } else {
              this.notificationService.danger('Reset password failed. Check if new and old password are different.');
            }
          },
          () => {
            this.notificationService.danger('Reset password failed.');
          }
        );
      } else {
        this.notificationService.danger('Verify your password confirmation.');
      }
    } else {
      this.notificationService.danger('Please fill a strong new password.');
    }
  }

  getPasswordStrength(passwordStrength: boolean) {
    this.passwordStrength = passwordStrength;
  }
}
