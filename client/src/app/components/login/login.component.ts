import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'app/controllers/login-controller/login.service';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    MatButtonModule,
    SpinnerComponent
  ]
})
export class LoginComponent {

  // Reactive login form
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(6),
      Validators.maxLength(254),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(255),
    ]),
  });

  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackbar: MatSnackBar,
  ) { }

  // Error message for email based on validators
  emailErrorMessage() {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'You must enter an email.';
    }
    if (this.loginForm.get('email')?.hasError('minlength')) {
      return 'Minimum email length: 6';
    }
    if (this.loginForm.get('email')?.hasError('maxlength')) {
      return 'Maximum email length: 254';
    }
    return this.loginForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }

  // Error message for password based on validators
  passwordErrorMessage() {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'You must enter an password.';
    }
    if (this.loginForm.get('password')?.hasError('minlength')) {
      return 'Minimum password length: 10';
    }
    if (this.loginForm.get('password')?.hasError('maxlength')) {
      return 'Maximum password length: 255';
    }
    return '';
  }

  onSubmit() {
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginService.login(loginData).subscribe({
      next: (response: any) => {

        const authToken = response?.success?.accessToken;
        const accountType = response?.success?.accountType;

        // Check if the authentication token is present in the response
        if (authToken) {
          // Store the authentication token in local storage
          localStorage.setItem("jwt-auth-token", authToken);

          // Navigate based on the account type
          if (accountType === environment.industryType) {
            this.router.navigate(['/industry/dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackbar.open('Log in successful!', 'Dismiss', {
                  duration: 5000
                });
              }
            });
          } else if (accountType === environment.studentType) {
            this.router.navigate(['/student/dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackbar.open('Log in successful!', 'Dismiss', {
                  duration: 5000
                });
              }
            });
          } else {
            this.router.navigate(['/faculty/dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackbar.open('Log in successful!', 'Dismiss', {
                  duration: 5000
                });
              }
            });
          }
        } else {
          console.error('Authentication token not found in the response.');
        }
      },
      error: (error) => {
        console.error('error logging in', error);
        this.snackbar.open('Error logging in', 'Dismiss', {
          duration: 5000
        });
      },
    });
  }
}
