import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  email: string = '';
  password: string = '';
  name: string = '';

  url: string = environment.registerApiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const data = {
      email: this.email,
      password: this.password,
      name: this.name
    };

    /*
    success: {
                    status: 200,
                    message: 'REGISTER_SUCCESS',
                    accessToken: access_token,
                    refreshToken: refreshToken,
                    user: {
                        id: user.id,
                        email: user.email,
                    }
                }
                */
    this.http.post(this.url, data)
      .subscribe((response: any) => {
        console.log('Registration successful!', response);
        const data = {
          token: response.success.accessToken,
          refresh: response.success.refreshToken
        }

        localStorage.setItem("jwt-auth-token", data.token);
        localStorage.setItem("jwt-refr-token", data.refresh);

        this.router.navigate(['/home']);
      }, (error: any) => {
        console.error('Registration failed.', error);
      });
  }
}
