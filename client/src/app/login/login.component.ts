import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  apiUrl = environment.apiUrl;
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post(`${this.apiUrl}/login`, loginData).subscribe(
      (response: any) => {
        console.log('login success', response);

        // Check if the authentication token is present in the response
        const authToken = response?.success?.accessToken;
        if (authToken) {
          // Store the authentication token in local storage
          localStorage.setItem("jwt-auth-token", authToken);

          // Redirect or perform any other action upon successful login
          this.router.navigate(['/faculty-dashboard']);
        } else {
          console.error('Authentication token not found in the response.');
        }
      },
      (error) => {
        console.error('error logging in', error);
      }
    );
  }
}
