import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/controllers/auth-controller/auth.service';
import { EmailService } from 'app/controllers/email-controller/email.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
  imports: []
})
export class ConfirmEmailComponent implements OnInit {
  public href: string = "";
  public token: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailService: EmailService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const emailToken = this.route.snapshot.paramMap.get('emailToken');
    if (!emailToken) {
      this.redirectToLogin('Invalid email confirmation token');
      return;
    }

    this.emailService.confirmEmail(emailToken).subscribe({
      next: () => {
        this.authService.getAccountInfo().subscribe({
          next: (response: any) => {
            const userType = this.getUserType(response);
            if (!userType) {
              this.redirectToLogin('Erroneous account type');
            }

            const dashboardRoute = `/${userType}/dashboard`;
            this.router.navigate([dashboardRoute]).then((navigated: boolean) => {
              this.snackbar.open('Email successfully confirmed!', 'Dismiss', {
                duration: 5000,
              });
            });
          },
          error: (error: any) => {
            console.error('Cannot retrieve account details', error);
            this.redirectToLogin('Error retrieving account details');
          }
        });
      },
      error: (error: any) => {
        this.redirectToLogin('Invalid email confirmation token');
      }
    });
  }

  private redirectToLogin(message: string): void {
    this.router.navigate(['/login']).then((navigated: boolean) => {
      this.snackbar.open(message, 'Dismiss', {
        duration: 5000,
      })
    });
  }

  private getUserType(accountInfo: any): string {
    const userType = accountInfo.success.accountData.userType;

    if (userType === 0) {
      return 'student';
    } else if (userType === 1) {
      return 'faculty';
    } else if (userType === 2) {
      return 'industry';
    } else {
      console.error('Invalid user type', accountInfo);
      return '';
    }
  }
}
