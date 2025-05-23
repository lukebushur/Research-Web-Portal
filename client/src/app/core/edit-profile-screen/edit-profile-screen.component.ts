import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from '../user-profile-service/user-profile.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile-screen',
  templateUrl: './edit-profile-screen.component.html',
  styleUrls: ['./edit-profile-screen.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ]
})
export class EditProfileScreenComponent implements OnInit {
  // Set up the variables for the universityLocation dropdown
  universityLocations: string[] = [
    'Purdue University Fort Wayne',
    'Purdue University',
  ];

  prevSelectedUniversity: string | undefined | null;

  majors: string[] = [];

  accountType: number = 1;

  // FormGroup that shows the inputs that will be on the page along with the validators
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

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private snackbar: MatSnackBar
  ) { }

  // initialize the form with the user's previously-entered profile information
  ngOnInit(): void {
    this.updateForm();
  }

  // navigate to the forgot-password page
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

  // update the form, including possible university majors and profile information
  updateForm(): void {
    // Majors offered is dependent on university. Therefore, whenever the
    // selected university changes, and the selected university is different
    // from the previously selected unversity, make a request to update the
    // dropdown list of possible majors that the user can choose from.
    if (!this.prevSelectedUniversity || this.prevSelectedUniversity !== this.editProfileForm.get('universityLocation')?.value) {
      this.majors = [];
      this.prevSelectedUniversity = this.editProfileForm.get('universityLocation')?.value;

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

    // get the user's profile information and update the form initial values
    // based on the retrieved data
    this.userProfileService.getAccountInfo().subscribe({
      next: (data: any) => {
        const accountInfo = data.success.accountData;
        console.log(accountInfo);

        this.editProfileForm.get('name')?.setValue(accountInfo.name);
        this.editProfileForm.get('GPA')?.setValue(accountInfo.GPA);
        this.editProfileForm.get('Major')?.setValue(accountInfo.Major);
        this.editProfileForm.get('universityLocation')?.setValue(accountInfo.universityLocation);
        this.accountType = accountInfo.userType;
        if (accountInfo.userType === 0) {
          this.editProfileForm.get('GPA')?.enable();
          this.editProfileForm.get('Major')?.enable();
        } else {
          this.editProfileForm.get('GPA')?.disable();
          this.editProfileForm.get('Major')?.disable();
        }
      },
      error: (data: any) => {
        console.log("Error", data);
      }
    });
  }

  // submit profile changes through request to the back end
  onSubmit() {
    this.userProfileService.submitProfileChanges(this.editProfileForm.value).subscribe({
      next: (data: any) => {
        if (data.success) {
          console.log('Profile Updated Successfully');
          this.snackbar.open('Profile successfully updated!', 'Dismiss', {
            duration: 5000
          });
        }
      },
      error: (data: any) => {
        console.error('Profile change request failed', data);
        this.snackbar.open('Error updating profile', 'Dismiss', {
          duration: 5000
        });
      }
    });
  }
}
