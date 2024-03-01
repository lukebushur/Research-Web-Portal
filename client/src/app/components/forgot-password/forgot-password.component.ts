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
  });

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

  onSubmit() {
    const email = this.forgotForm.value.email!;
    
    this.loginService.forgotPassword(email).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/forgot-password-submitted']);
        }
      },
      error: (error) => {
        console.log('Error', error);
        this.snackbar.open('Request password reset failed.', 'Dismiss');
      },
    });
  }
}
