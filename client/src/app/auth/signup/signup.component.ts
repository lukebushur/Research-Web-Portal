import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth-service/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignupBody } from '../models/request-bodies';
import { UserProfileService } from 'app/core/user-profile-service/user-profile.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface AccountType {
  value: number;
  text: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressBarModule,
    RouterLink,
    MatCheckboxModule,
  ]
})
export class SignupComponent {

  // Set up the variables for the universityLocation dropdown
  universityLocations: string[] = [
    'Purdue University Fort Wayne',
  ];

  // University that the user previously selected
  // This is used to cut down on requests to the back-end, as if the same university
  // is selected twice in a row by the same user, there is no need to get the majors
  // list from the back-end again
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
      Validators.pattern('^[0-4](\\.(\\d\\d?)?)?$'),
    ]),
    Major: new FormControl('', [
      Validators.required,
    ]),
    termsOfService: new FormControl(false, [Validators.requiredTrue])
  })

  // Whether the password should be hidden or shown
  hide: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private snackbar: MatSnackBar,
  ) { }

  // Error message for name based on validators
  nameErrorMessage(): string {
    if (this.signupForm.get('name')?.hasError('required')) {
      return 'Name is a required field';
    }
    if (this.signupForm.get('name')?.hasError('minlength')) {
      return 'Minimum length: 2';
    }
    if (this.signupForm.get('name')?.hasError('maxlength')) {
      return 'Maximum length: 25';
    }
    return '';
  }

  // Error message for email based on validators
  emailErrorMessage(): string {
    if (this.signupForm.get('email')?.hasError('required')) {
      return 'Email is a required field';
    }
    if (this.signupForm.get('email')?.hasError('minlength')) {
      return 'Minimum length: 6';
    }
    if (this.signupForm.get('email')?.hasError('maxlength')) {
      return 'Maximum length: 254';
    }
    return this.signupForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }

  // Error message for password based on validators
  passwordErrorMessage(): string {
    if (this.signupForm.get('password')?.hasError('required')) {
      return 'Password is a required field';
    }
    if (this.signupForm.get('password')?.hasError('minlength')) {
      return 'Minimum length: 10';
    }
    if (this.signupForm.get('password')?.hasError('maxlength')) {
      return 'Maximum length: 255';
    }
    return '';
  }

  // Error message for fields that have only Validators.required
  requiredFieldErrorMessage(fieldName: string, displayName: string): string {
    if (this.signupForm.get(fieldName)?.hasError('required')) {
      return displayName + ' is a required field';
    }
    return '';
  }

  // Error message for GPA based on validators
  gpaErrorMessage(): string {
    if (this.signupForm.get('GPA')?.hasError('required')) {
      return 'GPA is a required field'
    }
    if (this.signupForm.get('GPA')?.hasError('min')
      || this.signupForm.get('GPA')?.hasError('max')) {
      return 'GPA must be between 0.00 and 4.00';
    }
    if (this.signupForm.get('GPA')?.hasError('pattern')) {
      return 'GPA is invalid';
    }
    return '';
  }

  // Update the form based on the selected university and accountType
  //   Student accountType -> also needs to fill out their GPA and majors
  //   Any other accountType -> GPA and majors not required
  updateForm(): void {
    // Any accountType other than student -> GPA and majors not required
    if (this.signupForm.get('accountType')?.value !== 0) {
      this.signupForm.get('GPA')?.disable();
      this.signupForm.get('Major')?.disable();
      return;
    }
    // Student accountType -> update majors list ONLY if the selected university
    // is not the same as the previously selected university. In this case,
    // the majors list is already stored
    if (!this.prevSelectedUniversity || this.prevSelectedUniversity !== this.signupForm.get('universityLocation')?.value) {
      this.majors = [];
      this.prevSelectedUniversity = this.signupForm.get('universityLocation')?.value;

      this.userProfileService.getMajors(
        this.prevSelectedUniversity ?? undefined
      ).subscribe({
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

  routeToLoginPage() {
    this.router.navigateByUrl('/login');
  }

  onSubmit() {
    const data = {
      ...this.signupForm.value
    };
    delete data.termsOfService;
    const signupData: SignupBody = data;

    this.authService.signup(signupData).subscribe({
      next: (data: any) => {
        if (data.success) {
          // Navigate to notify the user to confirm email
          this.router.navigateByUrl('/notify-confirm-email');
        } else {
          console.error('Error signing up', data);
        }
      },
      error: (data: any) => {
        console.error('Registration failed.', data);
        if (data?.error?.error?.message === 'EMAIL_EXISTS') {
          alert('Registration failed, email already exists');
        }
        else {// Notify user of registration failure
          alert('Registration failed. Please try again later.');
        }
      },
    });
  }
}
