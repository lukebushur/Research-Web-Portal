import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-submitted',
  templateUrl: './forgot-password-submitted.component.html',
  styleUrls: ['./forgot-password-submitted.component.css'],
  imports: [RouterLink, MatCardModule]
})
export class ForgotPasswordSubmittedComponent { }
