import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(25)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(6),
    Validators.maxLength(254)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(255)
  ]);

  url: string = environment.registerApiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter an email.';
    }
    if (this.email.hasError('minlength')) {
      return 'Minimum email length: 6';
    }
    if (this.email.hasError('maxlength')) {
      return 'Maximum email length: 254';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getNameErrorMessage() {
    if (this.name.hasError('required')) {
      return 'You must enter a name.';
    }
    if (this.name.hasError('minlength')) {
      return 'Minimum name length: 2';
    }
    if (this.name.hasError('maxlength')) {
      return 'Maximum name length: 25';
    }
    return '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter an password.';
    }
    if (this.password.hasError('minlength')) {
      return 'Minimum password length: 10';
    }
    if (this.password.hasError('maxlength')) {
      return 'Maximum password length: 255';
    }
    return '';
  }

  isValidInput() {
    return false;
  }

  onSubmit() {
    const data = {
      email: this.email.value,
      password: this.password.value,
      name: this.name.value
    };

    // success: {
    //   status: 200,
    //   message: 'REGISTER_SUCCESS',
    //   accessToken: access_token,
    //   refreshToken: refreshToken,
    //   user: {
    //       id: user.id,
    //       email: user.email,
    //   }
    // }

    this.http.post(this.url, data).subscribe({
      next: (response: any) => {
        console.log('Registration successful!', response);
        const data = {
          token: response.success.accessToken,
          refresh: response.success.refreshToken
        }

        localStorage.setItem("jwt-auth-token", data.token);
        localStorage.setItem("jwt-refr-token", data.refresh);

        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Registration failed.', error);
      }
    });
  }
}
