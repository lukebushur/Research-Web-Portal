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
import { Location } from '@angular/common';

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
    private profileService: ProfileServiceService, private location: Location ) { }

  // Set up the variables for the universityLocation dropdown 
  universityLocations: string[] = [
    'Purdue University Fort Wayne',
    'Purdue University',
  ];

  prevSelectedUniversity: string | undefined | null;

  majors: string[] = [];

  //formgroup that shows the inputs that will be on the page along with the validators
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

  //on initialization update the form with the updated values
  ngOnInit(): void {
    this.updateForm();
  }

  //function that navigates to the forgot password screen
  navigateToEmailResetScreen() {
    this.router.navigate(['/forgot-password']);
  }

  // Error message for name based on validators
  nameErrorMessage(): string {
    if (this.editProfileForm.get('name')?.hasError('required')) {
      return 'Name is a required field';//name must submit something
    }
    if (this.editProfileForm.get('name')?.hasError('minlength')) {
      return 'Minimum length: 2'; //name must be min length 2
    }
    if (this.editProfileForm.get('name')?.hasError('maxlength')) {
      return 'Maximum length: 25';//name must be max length 25
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

  //function that updates the form with the most updated values, also will update whenever you switch universities to get the correct majors list
  async updateForm(): Promise<void> {
    //upon change in the university value
    if (!this.prevSelectedUniversity || this.prevSelectedUniversity !== this.editProfileForm.get('universityLocation')?.value) {
      this.majors = [];
      this.prevSelectedUniversity = this.editProfileForm.get('universityLocation')?.value;
      const getMajorsPromise = await this.authService.getMajors(this.prevSelectedUniversity ?? undefined);//gets the list of majors for new university
      getMajorsPromise.subscribe({
        next: (data: any) => {
          if (data.success) {
            this.majors = data.success.majors.toSorted();//upon success get the list of majors in order
          }
        },
        error: (data: any) => {
          console.log('Error', data);
        },
      });
    }
    //gets the current information about the account
    this.authService.getAccountInfo().subscribe({
      next: (data: any) => {
        //updates the profile form value with the current info upon success
        const accountInfo = data.success.accountData;
        this.editProfileForm.get('name')?.setValue(accountInfo.name);
        this.editProfileForm.get('GPA')?.setValue(accountInfo.GPA);
        this.editProfileForm.get('Major')?.setValue(accountInfo.Major);
        this.editProfileForm.get('universityLocation')?.setValue(accountInfo.universityLocation);
      },
      error: (data: any) => {
        console.log("Error", data);
      }
    })
    this.editProfileForm.get('GPA')?.enable();
    this.editProfileForm.get('Major')?.enable();
  }

  onSubmit() {
    //calls the profile service to make changes with the given input
    this.profileService.submitProfileChanges(this.editProfileForm.value).subscribe({
      next: (data: any) => {
        console.log('Profile Updated Successfully');//response for a successful profile update
      },
      error: (data: any) => {
        console.error('Profile change request failed', data);
      }
    });
  }
}
