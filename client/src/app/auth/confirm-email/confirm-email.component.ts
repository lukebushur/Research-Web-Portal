import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
  imports: [MatCardModule]
})
export class ConfirmEmailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    const emailToken = this.route.snapshot.paramMap.get('emailToken');

    if (!(emailToken && userId)) {
      return this.redirectToLogin('Invalid email confirmation token');
    }

    this.authService.confirmEmail(userId, emailToken).subscribe({
      next: () => {
        this.redirectToLogin('Email successfully confirmed! Please login to continue.');
      },
      error: (error: any) => {
        this.redirectToLogin('Invalid request; log in again to request a new link.');
      }
    });
  }

  private redirectToLogin(message: string): void {
    this.router.navigateByUrl('/login').then(() => {
      this.snackbar.open(message, 'Dismiss', {
        duration: 5000,
      });
    });
  }
}
