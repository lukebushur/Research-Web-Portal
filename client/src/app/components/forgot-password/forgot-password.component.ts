import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/controllers/login-controller/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  // Reactive forgot password form
  forgotForm = new FormGroup({
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

  // Whether the password should be hidden or shown
  hide: boolean = true;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackbar: MatSnackBar,
  ) { }

  // Error message for email based on validators
  emailErrorMessage(): string {
    if (this.forgotForm.get('email')?.hasError('required')) {
      return 'You must enter an email.';
    }
    if (this.forgotForm.get('email')?.hasError('minlength')) {
      return 'Minimum email length: 6';
    }
    if (this.forgotForm.get('email')?.hasError('maxlength')) {
      return 'Maximum email length: 254';
    }
    return this.forgotForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }

  // Error message for password based on validators
  passwordErrorMessage(): string {
    if (this.forgotForm.get('password')?.hasError('required')) {
      return 'You must enter an password.';
    }
    if (this.forgotForm.get('password')?.hasError('minlength')) {
      return 'Minimum password length: 10';
    }
    if (this.forgotForm.get('password')?.hasError('maxlength')) {
      return 'Maximum password length: 255';
    }
    return '';
  }

  onSubmit() {
    const forgotData = {
      email: this.forgotForm.value.email,
      provisionalPassword: this.forgotForm.value.password,
    };

    this.loginService.forgotPassword(forgotData).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/forgot-password-submitted']);
        }
      },
      error: (error) => {
        this.snackbar.open('Request password reset failed.', 'Dismiss');
      },
    });
  }
}
