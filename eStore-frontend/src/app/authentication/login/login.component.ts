import { Component } from '@angular/core';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  faFacebook = faFacebookF;
  faTwitter = faTwitter;
  loginForm: FormGroup;
  loginFailed: boolean = false;
  loginError: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      userEmailorUserName: ['', [Validators.required]],
      userPassword: ['', [Validators.required]],
    });
  }
  onLogin() {
    if (this.loginForm !== null && this.loginForm.valid) {
      const formData: FormData = new FormData();
      Object.keys(this.loginForm.value).forEach((key) => {
        formData.append(key, this.loginForm.value[key]);
      });

      // Sending request
      this.authService.login(formData).subscribe(
        (response) => {
          if (response.token) {
            this.notificationService.showNotification(
              'Success',
              'Logged In successfully',
              'toast-success'
            );
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('isLoggedIn', 'true');
            // form reset
            this.loginForm.reset();
            this.router.navigate(['']);
          }
        },
        (error) => {
          this.loginFailed = true;
          this.loginError = error.error.error;
          console.log(this.loginError);
          this.notificationService.showNotification(
            'Error',
            // 'An error occurred while logging in!',
            this.loginError,
            'toast-error'
          );
        }
      );

      // form reset
      // this.myForm.reset();
    }
  }
}
