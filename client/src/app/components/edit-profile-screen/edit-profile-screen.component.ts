import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/controllers/auth-controller/auth.service';
import { ProfileServiceService } from 'src/app/controllers/profile-controller/profile-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-edit-profile-screen',
  templateUrl: './edit-profile-screen.component.html',
  styleUrls: ['./edit-profile-screen.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ]
})
export class EditProfileScreenComponent implements OnInit {
  constructor(private router: Router,
    private authService: AuthService,
    private profileService: ProfileServiceService,) { }

  // Set up the variables for the universityLocation dropdown 
  universityLocations: string[] = [
    'Purdue University Fort Wayne',
    'Purdue University',
  ];

  prevSelectedUniversity: string | undefined | null;

  majors: string[] = [];

  editProfileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25),
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
    universityLocation: new FormControl(this.universityLocations[0], [
      Validators.required,
    ]),
  })

  ngOnInit(): void {
    this.updateForm();
  }

  navigateToEmailResetScreen() {
    this.router.navigate(['/forgot-password']);
  }

  // Error message for name based on validators
  nameErrorMessage(): string {
    if (this.editProfileForm.get('name')?.hasError('required')) {
      return 'Name is a required field';
    }
    if (this.editProfileForm.get('name')?.hasError('minlength')) {
      return 'Minimum length: 2';
    }
    if (this.editProfileForm.get('name')?.hasError('maxlength')) {
      return 'Maximum length: 25';
    }
    return '';
  }

  // Error message for GPA based on validators
  gpaErrorMessage(): string {
    if (this.editProfileForm.get('GPA')?.hasError('required')) {
      return 'GPA is a required field'
    }
    if (this.editProfileForm.get('GPA')?.hasError('min')
      || this.editProfileForm.get('GPA')?.hasError('max')) {
      return 'GPA must be between 0.00 and 4.00';
    }
    if (this.editProfileForm.get('GPA')?.hasError('pattern')) {
      return 'GPA is invalid';
    }
    return '';
  }

  // Error message for fields that have only Validators.required
  requiredFieldErrorMessage(fieldName: string, displayName: string): string {
    if (this.editProfileForm.get(fieldName)?.hasError('required')) {
      return displayName + ' is a required field';
    }
    return '';
  }

  async updateForm(): Promise<void> {
    if (!this.prevSelectedUniversity || this.prevSelectedUniversity !== this.editProfileForm.get('universityLocation')?.value) {
      this.majors = [];
      this.prevSelectedUniversity = this.editProfileForm.get('universityLocation')?.value;
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
    this.editProfileForm.get('GPA')?.enable();
    this.editProfileForm.get('Major')?.enable();
  }

  onSubmit() {
    // TODO: fix majors and GPA not changing
    this.profileService.submitProfileChanges(this.editProfileForm.value).subscribe({
      next: (data: any) => {
        console.log('Profile Updated Successfully');
      },
      error: (data: any) => {
        console.error('Profile change request failed', data);
      }
    });
  }
}
