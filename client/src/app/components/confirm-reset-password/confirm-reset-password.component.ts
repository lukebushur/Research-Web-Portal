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
    const email = this.route.snapshot.paramMap.get('email');
    const id = this.route.snapshot.paramMap.get('id');

    if (!email || !id) {
      this.router.navigate(['/login']).then((navigated: boolean) => {
        if (navigated) {
          this.snackbar.open('Reset password failed: Invalid credentials', 'Dismiss');
        }
      });
    }

    this.loginService.confirmResetPassword({
      email: email,
      passwordResetToken: id,
    }).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/login']).then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Reset password successful!', 'Dismiss');
            }
          });
        }
      },
      error: (data: any) => {
        this.router.navigate(['/login']).then((navigated: boolean) => {
          if (navigated) {
            this.snackbar.open('Reset password failed: Invalid credentials', 'Dismiss');
          }
        });
      },
    });
  }
}
