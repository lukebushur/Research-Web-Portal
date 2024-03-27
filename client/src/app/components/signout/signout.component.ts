import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignoutService } from 'src/app/controllers/signout-controller/signout.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css'],
  standalone: true,
  imports: [MatSnackBarModule],
})
export class SignoutComponent implements OnInit {

  constructor(
    private router: Router,
    private signoutService: SignoutService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.signoutService.signout();
    this.router.navigate(['/login']).then((navigated: boolean) => {
      if (navigated) {
        this.snackbar.open('You have been successfully signed out!', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }
}
