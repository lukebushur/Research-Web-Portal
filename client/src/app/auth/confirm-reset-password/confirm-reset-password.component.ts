import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmResetPasswordBody } from '../models/request-bodies';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class ConfirmResetPasswordComponent {
  // Route parameters
  email: string | null;
  id: string | null;

  // Reactive confirm form
  confirmForm = new FormGroup({
    provisionalPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(255),
    ]),
  });

  // Whether the password should be hidden or shown
  hide: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // get route parameters
    this.email = this.route.snapshot.paramMap.get('email');
    this.id = this.route.snapshot.paramMap.get('id');

    // no route parameters given -> erroneous usage of the route
    if (!this.email || !this.id) {
      this.router.navigateByUrl('/login').then((navigated: boolean) => {
        if (navigated) {
          this.snackbar.open('Reset password failed: Invalid credentials', 'Dismiss');
        }
      });
    }
  }

  // Error message for password based on validators
  passwordErrorMessage(): string {
    if (this.confirmForm.get('provisionalPassword')?.hasError('required')) {
      return 'You must enter an password.';
    }
    if (this.confirmForm.get('provisionalPassword')?.hasError('minlength')) {
      return 'Minimum password length: 10';
    }
    if (this.confirmForm.get('provisionalPassword')?.hasError('maxlength')) {
      return 'Maximum password length: 255';
    }
    return '';
  }

  onSubmit(): void {
    const data: ConfirmResetPasswordBody = {
      email: this.email,
      passwordResetToken: this.id,
      provisionalPassword: this.confirmForm.get('provisionalPassword')?.value,
    };

    // attempt to confirm the password reset against the back-end
    this.authService.confirmResetPassword(data).subscribe({
      next: (data: any) => {
        if (data.success) {
          // on success, the password is changed, and the user is redirected to
          // the login page
          this.router.navigateByUrl('/login').then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Reset password successful!', 'Dismiss');
            }
          });
        }
      },
      error: (data: any) => {
        // on error, the password is not changed, and the user is redirected to
        // the login page
        console.log('Error', data);
        this.router.navigateByUrl('/login').then((navigated: boolean) => {
          if (navigated) {
            this.snackbar.open('Reset password failed: Invalid credentials', 'Dismiss');
          }
        });
      },
    });
  }
}
