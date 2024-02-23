import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from 'src/app/controllers/signup-controller/signup.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/controllers/auth-controller/auth.service';

interface AccountType {
  value: number;
  text: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  // Set up the variables for the universityLocation dropdown 
  universityLocations: string[] = [
    'Purdue University Fort Wayne',
    'Purdue University',
  ];

  prevSelectedUniversity: string | undefined | null;
  
  // Set up the variables for the account type dropdown 
  accountTypes: AccountType[] = [
    { value: 0, text: 'Student' },
    { value: 1, text: 'Faculty' },
    { value: 2, text: 'Industry' },
  ];

  // Set up the variables for the major dropdown
  majors: string[] = [];

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
    universityLocation: new FormControl(this.universityLocations[0], [
      Validators.required,
    ]),
    accountType: new FormControl<number | null>(null, [
      Validators.required,
    ]),
    GPA: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(4),
    ]),
    Major: new FormControl('', [
      Validators.required,
    ]),
  })

  // Whether the password should be hidden or shown
  hide: boolean = true;

  constructor(
    private router: Router,
    private signupService: SignupService,
    private authService: AuthService,
  ) { }

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

  async updateForm(): Promise<void> {
    if (this.signupForm.get('accountType')?.value !== 0) {
      this.signupForm.get('GPA')?.disable();
      this.signupForm.get('Major')?.disable();
      return;
    }
    if (!this.prevSelectedUniversity || this.prevSelectedUniversity !== this.signupForm.get('universityLocation')?.value) {
      this.majors = [];
      this.prevSelectedUniversity = this.signupForm.get('universityLocation')?.value;
      const getMajorsPromise = await this.authService.getMajors(this.prevSelectedUniversity ?? undefined);
      getMajorsPromise.subscribe({
        next: (data: any) => {
          if (data.success) {
            this.majors = data.success.majors.toSorted();
          }
        },
        error: (data: any) => {
          console.log('Error', data);
        },
      });
    }
    this.signupForm.get('GPA')?.enable();
    this.signupForm.get('Major')?.enable();
  }

  onSubmit() {
    this.signupService.signup(this.signupForm.value).subscribe({
      next: (data: any) => {
        console.log('Registration Successful!', data);

        const authToken = data?.success?.accessToken;
        const refreshToken = data?.success?.refreshToken;
        const accountType = data?.success?.user.accountType;

        // Check if the authentication token is present in the response
        if (authToken) {
          // Store the authentication token and refresh token in local storage
          localStorage.setItem("jwt-auth-token", authToken);
          localStorage.setItem("jwt-refr-token", refreshToken);

          // Navigate based on the account type
          if (accountType === environment.industryType) {
            this.router.navigate(['/industry/dashboard']);
          } else if (accountType === environment.studentType) {
            this.router.navigate(['/student-dashboard']);
          } else {
            this.router.navigate(['/faculty-dashboard']);
          }
        } else {
          console.error('Authentication token not found in the response.');
        }
      },
      error: (data: any) => {
        console.error('Registration failed.', data);
      },
    });
  }
}
