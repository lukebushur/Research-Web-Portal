import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from 'src/app/controllers/signup-controller/signup.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  // Reactive registration form
  signupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(6),
      Validators.maxLength(254),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(255),
    ]),
  })

  // Setup the variables for the account type slider 
  accountType: string = "ThisStringShouldChange";
  accountTypeInt: number = 0;
  typeToString: Array<string> = [
    "Student",
    "Faculty",
    "Industry"
  ];

  constructor(private router: Router, private signupService: SignupService) {
    this.accountType = this.typeToString[this.accountTypeInt - 1];
  }

  // Error message for email based on validators
  emailErrorMessage() {
    if (this.signupForm.get('email')?.hasError('required')) {
      return 'You must enter an email.';
    }
    if (this.signupForm.get('email')?.hasError('minlength')) {
      return 'Minimum email length: 6';
    }
    if (this.signupForm.get('email')?.hasError('maxlength')) {
      return 'Maximum email length: 254';
    }
    return this.signupForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }

  // Error message for name based on validators
  nameErrorMessage() {
    if (this.signupForm.get('name')?.hasError('required')) {
      return 'You must enter a name.';
    }
    if (this.signupForm.get('name')?.hasError('minlength')) {
      return 'Minimum name length: 2';
    }
    if (this.signupForm.get('name')?.hasError('maxlength')) {
      return 'Maximum name length: 25';
    }
    return '';
  }

  // Error message for password based on validators
  passwordErrorMessage() {
    if (this.signupForm.get('password')?.hasError('required')) {
      return 'You must enter an password.';
    }
    if (this.signupForm.get('password')?.hasError('minlength')) {
      return 'Minimum password length: 10';
    }
    if (this.signupForm.get('password')?.hasError('maxlength')) {
      return 'Maximum password length: 255';
    }
    return '';
  }

  // This is to setup the Account Type system of the signup page
  // This will handle the input of the 
  onInputChange(event: Event) {
    // This converts the string value to an integer
    // Which then correlates to an "account type"
    const value : number = parseInt((event.target as HTMLInputElement).value);
    // Set the integer, this is used in the request. 
    // It should be 0-2, 0 for Student, 1 for Faculty, 2 for Industry
    this.accountTypeInt = value;
    // This converts the account-type to an array-supported index without having
    // a "nil" entry in the array which looks weird
    this.accountType = this.typeToString[this.accountTypeInt];
  }

  onSubmit() {
    const data = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      name: this.signupForm.value.name,
      accountType: this.accountTypeInt, // Pass in the user account type
    };

    this.signupService.signup(data).subscribe({
      next: (response: any) => {
        console.log('Registration Successful!', response);

        const authToken = response?.success?.accessToken;
        const refreshToken = response?.success?.refreshToken;
        const accountType = response?.success?.user.accountType;

        // Check if the authentication token is present in the response
        if (authToken) {
          // Store the authentication token and refresh token in local storage
          localStorage.setItem("jwt-auth-token", authToken);
          localStorage.setItem("jwt-refr-token", refreshToken);

          // Navigate based on the account type
          if (accountType === environment.industryType) {
            this.router.navigate(['/industry-dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          console.error('Authentication token not found in the response.');
        }
      },
      error: (error: any) => {
        console.error('Registration failed.', error);
      },
    });
  }
}
