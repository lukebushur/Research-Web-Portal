import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/controllers/login-controller/login.service';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.css']
})
export class ConfirmResetPasswordComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // get route parameters
    const email = this.route.snapshot.paramMap.get('email');
    const id = this.route.snapshot.paramMap.get('id');

    // no route parameters given -> erroneous usage of the route
    if (!email || !id) {
      this.router.navigate(['/login']).then((navigated: boolean) => {
        if (navigated) {
          this.snackbar.open('Reset password failed: Invalid credentials', 'Dismiss');
        }
      });
    }

    // attempt to confirm the password reset against the back-end
    this.loginService.confirmResetPassword({
      email: email,
      passwordResetToken: id,
    }).subscribe({
      next: (data: any) => {
        if (data.success) {
          // on success, the password is changed, and the user is redirected to
          // the login page
          this.router.navigate(['/login']).then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Reset password successful!', 'Dismiss');
            }
          });
        }
      },
      error: (data: any) => {
        // on error, the password is not changed, and the user is redirected to
        // the login page
        this.router.navigate(['/login']).then((navigated: boolean) => {
          if (navigated) {
            this.snackbar.open('Reset password failed: Invalid credentials', 'Dismiss');
          }
        });
      },
    });
  }
}
