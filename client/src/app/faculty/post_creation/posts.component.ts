import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../faculty-service/faculty.service'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CreateQuestionsFormComponent } from 'app/shared/create-questions-form/create-questions-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule, MatTimepickerOption } from '@angular/material/timepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileService } from 'app/core/user-profile-service/user-profile.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatIconModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    CreateQuestionsFormComponent,
    MatSnackBarModule,
  ]
})
export class PostProjectComponent implements OnInit {
  projectID: string | null; // project ID from route parameter (null if create project)
  projectType: string | null; // project type from route parameter (null if create project)

  initialProjectData?: any; // project data (for updating an existing project)
  isCreateProject: boolean = true; // false for updating a project

  projectForm = this.fb.group({
    details: this.fb.group({
      projectName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      majors: [[], [Validators.required]],
      categories: this.fb.array([], [Validators.required]),
      deadlineDate: this.fb.control<Date | null>(null, [Validators.required]),
      deadlineTime: this.fb.control<Date | null>(null, [Validators.required]),
      responsibilities: [''],
      GPA: ['', [
        Validators.min(0),
        Validators.max(4),
        Validators.pattern('^[0-4](\\.(\\d\\d?)?)?$'),
      ]],
    }),
    questionsGroup: this.fb.group({
      questions: this.fb.array([]),
    }),
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  majorsList: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private announcer: LiveAnnouncer,
    private facultyService: FacultyService,
    private userProfileService: UserProfileService,
    private snackbar: MatSnackBar,
  ) { }

  get details() {
    return this.projectForm.get('details') as FormGroup;
  }

  get questionsGroup() {
    return this.projectForm.get('questionsGroup') as FormGroup;
  }

  get categories() {
    return this.details.get('categories') as FormArray;
  }

  get deadline() {
    const deadlineDate: Date | null = this.details.get('deadlineDate')!.value;
    const deadlineTime: Date | null = this.details.get('deadlineTime')!.value;

    if (!deadlineDate) {
      return null;
    }

    if (!deadlineTime) {
      return deadlineDate;
    }

    const deadline = new Date(deadlineDate.valueOf());
    deadline.setHours(
      deadlineTime.getHours(),
      deadlineTime.getMinutes(),
    );

    return deadline;
  }

  ngOnInit(): void {
    // Populate the majors list (for the dropdown menu)
    this.userProfileService.getMajors().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.majorsList = data.success.majors.toSorted();
        }
      },
      error: (data: any) => {
        console.log('Error retrieving majors', data);
      },
    });

    // Paramters set if the route is update-project
    this.projectID = this.route.snapshot.paramMap.get('projectID');
    this.projectType = this.route.snapshot.paramMap.get('projectType');
    if (!this.projectID || !this.projectType) {
      return;
    }
    // MongoDB IDs are of length 24
    if (this.projectID.length !== 24) {
      this.projectID = null;
      return;
    }

    this.isCreateProject = false;
    this.updateProjectInit();
  }

  updateProjectInit(): void {
    // Populate the form with the current project data
    this.facultyService.getProject(this.projectID!, this.projectType!).subscribe({
      next: (data: any) => {
        if (data.success) {
          const deadlineDate = data.success.project.deadline
            ? new Date(data.success.project.deadline)
            : null;
          let deadlineTime = null;
          if (deadlineDate) {
            deadlineTime = new Date();
            deadlineTime.setHours(
              deadlineDate.getHours(),
              deadlineDate.getMinutes(),
              deadlineDate.getSeconds(),
              deadlineDate.getMilliseconds(),
            );
          }

          this.initialProjectData = {
            ...data.success.project,
            // manually set deadline, since data has it as a string (or undefined)
            deadlineDate,
            deadlineTime,
          }

          // Set values in the projectForm
          this.details.get('projectName')?.setValue(this.initialProjectData.projectName);
          this.details.get('description')?.setValue(this.initialProjectData.description);
          this.details.get('majors')?.setValue(this.initialProjectData.majors);
          for (const category of this.initialProjectData.categories) {
            this.categories.push(this.fb.control(category));
          }
          this.details.get('deadlineDate')?.setValue(this.initialProjectData.deadlineDate);
          this.details.get('deadlineTime')?.setValue(this.initialProjectData.deadlineDate);
          this.details.get('responsibilities')?.setValue(this.initialProjectData.responsibilities || '');
          this.details.get('GPA')?.setValue(this.initialProjectData.GPA ? '' + this.initialProjectData.GPA : '');
        }
      },
      error: (data: any) => {
        this.projectID = null;
      }
    });
  }

  // Error message for fields with only Validators.required
  requiredFieldErrorMessage(fieldName: string, displayName: string): string {
    if (this.details.get(fieldName)?.hasError('required')) {
      return displayName + ' is a required field';
    }
    return '';
  }

  // Error message for GPA based on validators
  gpaErrorMessage(): string {
    if (this.details.get('GPA')?.hasError('min')
      || this.details.get('GPA')?.hasError('max')) {
      return 'GPA must be between 0.00 and 4.00';
    }
    if (this.details.get('GPA')?.hasError('pattern')) {
      return 'GPA is invalid';
    }
    return '';
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add the category
    if (value) {
      this.categories.push(this.fb.control(value));
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeCategory(index: number) {
    if (index >= 0) {
      this.categories.removeAt(index);

      this.announcer.announce(`Removed category at index ${index}`);
    }
  }

  editCategory(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove category if it no longer has a name
    if (!value) {
      this.removeCategory(index);
      return;
    }

    // Edit existing category
    if (index >= 0) {
      const categoryToEdit = this.categories.at(index) as FormControl;
      categoryToEdit.setValue(value);
    }
  }

  getTimeOptions(): MatTimepickerOption<Date>[] {
    const options: MatTimepickerOption<Date>[] = [];

    const date = new Date();
    date.setHours(23, 59);
    options.push({
      label: '11:59 PM',
      value: date
    })

    for (let h = 23; h >= 0; h--) {
      for (let m = 30; m >= 0; m -= 30) {
        const date = new Date();
        date.setHours(h, m);

        options.push({
          label: this.timeToString(h, m),
          value: date,
        });
      }
    }

    return options;
  }

  private timeToString(hours: number, minutes: number) {
    const hmod12 = hours % 12;
    const hourStr = hmod12 ? hmod12 : 12;

    const minuteStr = String(minutes).padStart(2, '0');

    const period = hours < 12 ? 'AM' : 'PM';

    return `${hourStr}:${minuteStr} ${period}`;
  }

  checkTime() {
    console.log(this.details.get('deadlineDate')?.value);
    console.log(this.details.get('deadlineTime')?.value);
    console.log(this.deadline);
  }

  // Navigate to the previous page
  cancel(): void {
    this.location.back();
  }

  // Generate data for sending to the server
  getSubmissionData(projType: string): any {
    const data = {
      projectType: projType,
      projectDetails: {
        project: {
          ...this.details.value,
          deadline: this.deadline,
          ...this.questionsGroup.value,
        },
      },
    };

    // Remove falsy fields
    for (const [key, value] of Object.entries(data.projectDetails.project)) {
      if (!value || key === 'deadlineDate' || key === 'deadlineTime') {
        delete data.projectDetails.project[key];
      }
    }
    if (projType === 'Active') {
      return data;
    }

    // Fill empty question fields with filler data
    // Required because server has specific validation for question data, and any
    // data that the user input in any of the fields would be preserved.
    for (const question of data.projectDetails.project.questions) {
      if (!question.question) {
        question.question = 'Temporary Question';
      }
      if (!question.requirementType) {
        question.requirementType = 'text';
      } else if (question.requirementType === 'check box' || question.requirementType === 'radio button') {
        for (let i = 0; i < question.choices.length; i++) {
          if (!question.choices[i]) {
            question.choices[i] = 'Temporary Choice ' + (i + 1);
          }
        }
      }
    }
    return data;
  }

  // Save the project as a draft (not all fields are required)
  onSave(): void {
    if (!this.isCreateProject) {
      return;
    }

    // Make the request to create the project draft
    this.facultyService.createPost(this.getSubmissionData('Draft')).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/faculty/dashboard']).then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Project draft successfully created!', 'Dismiss', {
                duration: 5000,
              });
            }
          });
        }
      },
      error: (data: any) => {
        console.error('Create draft failed.', data);
      }
    });
  }

  // Convert the project draft into an active project
  convertToActive(): void {
    if (this.projectForm.invalid) {
      this.snackbar.open('One or more fields are invalid', 'Dismiss', {
        duration: 5000,
      });
      return;
    }

    const updateData = {
      projectID: this.projectID!,
      ...this.getSubmissionData('Draft'),
    };

    // TODO: make HTTP request after the backend route is made
    this.facultyService.updateProject(updateData).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.facultyService.publishDraft(this.projectID!).subscribe({
            next: (data: any) => {
              if (data.success) {
                this.router.navigate(['/faculty/dashboard']).then((navigated: boolean) => {
                  if (navigated) {
                    this.snackbar.open('Project successfully published!', 'Dismiss', {
                      duration: 5000,
                    });
                  }
                });
              }
            },
            error: (data: any) => {
              console.log('Error publishing draft', data);
            }
          });
        }
      },
      error: (data: any) => {
        console.log('Error saving draft', data);
      }
    });
  }

  // Make the request to create the project
  createProject(data: any): void {
    this.facultyService.createPost(data).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/faculty/dashboard']).then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Project successfully created!', 'Dismiss', {
                duration: 5000,
              });
            }
          });
        }
      },
      error: (data: any) => {
        console.error('Create project failed.', data);
      }
    });
  }

  // Make the request to update the project
  updateProject(data: any): void {
    const updateData = {
      projectID: this.projectID!,
      ...data,
    };
    this.facultyService.updateProject(updateData).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/faculty/dashboard']).then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Project successfully updated!', 'Dismiss', {
                duration: 5000,
              });
            }
          });
        }
      },
      error: (data: any) => {
        console.error('Registration failed.', data);
      }
    });
  }

  // Called on form submission - either create the new project or update the
  // existing project depending on the active route
  onSubmit(): void {
    if (this.isCreateProject) {
      if (this.projectForm.invalid) {
        this.snackbar.open('One or more fields are invalid', 'Dismiss', {
          duration: 5000,
        });
        return;
      }
      this.createProject(this.getSubmissionData('Active'));
    } else {
      if (this.projectForm.invalid && this.projectType === 'Active') {
        this.snackbar.open('One or more fields are invalid', 'Dismiss', {
          duration: 5000,
        });
        return;
      }
      this.updateProject(this.getSubmissionData(this.projectType!));
    }
  }
}
