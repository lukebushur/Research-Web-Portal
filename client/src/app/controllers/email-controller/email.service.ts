import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  confirmEmail(): void {
    const authToken = this.authService.getHeaders();

    const data = {
      ["emailToken"]: this.getTokenFromUrl(),
    };

    this.http.post(`${this.apiUrl}/api/confirmEmail`, data, { headers: authToken })
      .subscribe(
        (response: any) => {
          //console.log('Email confirmation successful!', response);
          // TODO: Update this to the correct route
          // this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('Confirmation failed.', error);
        }
      );
  }

  private getTokenFromUrl(): string {
    const href = this.router.url;
    const token = href.split("/").pop();
    return token || '';
  }
}
