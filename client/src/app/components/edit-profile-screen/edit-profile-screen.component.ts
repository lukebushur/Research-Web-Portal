import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-screen',
  templateUrl: './edit-profile-screen.component.html',
  styleUrls: ['./edit-profile-screen.component.css']
})
export class EditProfileScreenComponent {
  constructor(private router: Router) {}

  navigateToEmailResetScreen() {
    this.router.navigate(['/forgot-password']);
  }
}
