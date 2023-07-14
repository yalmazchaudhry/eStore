import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  //icons
  faAsterik = faAsterisk;

  signUpForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.signUpForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
        ],
      ],
      userName: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(3),
        ],
      ],
      userPhone: [
        '',
        [
          Validators.maxLength(15),
          Validators.minLength(8),
          Validators.pattern(/^\+[1-9]{1}[0-9]{3,14}$/),
        ],
      ],
    });
  }
  onSignUp() {
    if (this.signUpForm !== null && this.signUpForm.valid) {
      const formData: FormData = new FormData();
      Object.keys(this.signUpForm.value).forEach((key) => {
        formData.append(key, this.signUpForm.value[key]);
      });

      // Sending request
      this.authService.signUp(formData).subscribe(
        (response) => {
          if (response.message == 'User created successfully!') {
            this.notificationService.showNotification(
              'Success',
              'User Created  successfully',
              'toast-success'
            );
            // form reset
            this.signUpForm.reset();
            this.router.navigate(['/login']);
          }
        },
        (error) => {
          this.notificationService.showNotification(
            'Success',
            'Error while creating user',
            'toast-success'
          );
          console.log(error);
        }
      );

      // form reset
      // this.myForm.reset();
    }
  }
}
