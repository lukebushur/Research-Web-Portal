import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css'],
  imports: [MatSnackBarModule]
})
export class SignoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.authService.signout();
    this.router.navigateByUrl('/login').then((navigated: boolean) => {
      if (navigated) {
        this.snackbar.open('You have been successfully signed out!', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }
}
