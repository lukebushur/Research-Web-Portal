import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { AddEditJobService } from 'src/app/controllers/add-edit-job-controller/add-edit-job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JobCardData } from '../industry-dashboard/job-card/job-card-data';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentChooserComponent } from './assessment-chooser/assessment-chooser.component';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';

@Component({
  selector: 'app-add-edit-job',
  templateUrl: './add-edit-job.component.html',
  styleUrls: ['./add-edit-job.component.css']
})
export class AddEditJobComponent {
  initialJobData?: JobCardData;
  isCreateJob: boolean = true;

  jobForm = new FormGroup({
    jobDetails: new FormGroup({
      employer: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      isInternship: new FormControl<boolean | null>(null, [Validators.required]),
      isFullTime: new FormControl<boolean | null>(null, [Validators.required]),
      description: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      reqYearsExp: new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^\d+$/)]),
      tags: new FormArray([]),
      timeCommitment: new FormControl(''),
      pay: new FormControl(''),
      deadline: new FormControl<Date | null>(null),
      range: new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      }),
    }),
    questionsGroup: new FormGroup({
      questions: new FormArray([]),
    }),
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private addEditJobService: AddEditJobService,
    private announcer: LiveAnnouncer,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('jobId');
    if (!jobId) {
      return;
    }

    this.isCreateJob = false;
    this.addEditJobService.getJob(jobId).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.initialJobData = JSON.parse(data.success.job);

          this.jobDetails.get('employer')?.setValue(this.initialJobData?.employer);
          this.jobDetails.get('title')?.setValue(this.initialJobData?.title);
          this.jobDetails.get('isInternship')?.setValue(this.initialJobData?.isInternship);
          this.jobDetails.get('isFullTime')?.setValue(this.initialJobData?.isFullTime);
          this.jobDetails.get('description')?.setValue(this.initialJobData?.description);
          this.jobDetails.get('location')?.setValue(this.initialJobData?.location);
          this.jobDetails.get('reqYearsExp')?.setValue(this.initialJobData?.reqYearsExp);
          for (const tag of this.initialJobData?.tags ?? []) {
            this.tags.push(new FormControl(tag));
          }
          this.jobDetails.get('timeCommitment')?.setValue(this.initialJobData?.timeCommitment ?? null);
          this.jobDetails.get('pay')?.setValue(this.initialJobData?.pay ?? null);
          const deadline = this.initialJobData?.deadline ? new Date(this.initialJobData.deadline) : null;
          this.jobDetails.get('deadline')?.setValue(deadline);
          this.jobDetails.get('reqYearsExp')?.setValue(this.initialJobData?.reqYearsExp);
          const startDate = this.initialJobData?.startDate ? new Date(this.initialJobData.startDate) : null;
          this.range.get('start')?.setValue(startDate);
          const endDate = this.initialJobData?.endDate ? new Date(this.initialJobData.endDate) : null;
          this.range.get('end')?.setValue(endDate);
        }
      }
    });
  }

  get jobDetails() {
    return this.jobForm.get('jobDetails') as FormGroup;
  }

  get jobQuestions() {
    return this.jobForm.get('questionsGroup') as FormGroup;
  }

  get range() {
    return this.jobDetails.get('range') as FormGroup;
  }

  get tags() {
    return this.jobDetails.get('tags') as FormArray;
  }

  get reqYearsExp() {
    return this.jobDetails.get('reqYearsExp') as FormControl;
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add the tag
    if (value) {
      this.tags.push(new FormControl(value));
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(index: number) {
    if (index >= 0) {
      this.tags.removeAt(index);

      this.announcer.announce(`Removed tag at index ${index}`);
    }
  }

  editTag(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.removeTag(index);
      return;
    }

    // Edit existing tag
    if (index >= 0) {
      const tagToEdit = this.tags.at(index) as FormControl;
      tagToEdit.setValue(value);
    }
  }

  cancel() {
    this.location.back();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AssessmentChooserComponent);

    dialogRef.afterClosed().subscribe((questions: QuestionData[]) => {
      if (!questions) {
        return;
      }

      const questionsArray = this.jobQuestions.get('questions') as FormArray;
      const defaultQuestionForm = questionsArray.length === 1 &&
        !questionsArray.at(0).get('question')?.value &&
        !questionsArray.at(0).get('requirementType')?.value
      if (defaultQuestionForm) {
        questionsArray.clear();
      }

      for (const question of questions) {
        const questionGroup = new FormGroup({
          question: new FormControl(question.question, [Validators.required]),
          requirementType: new FormControl(question.requirementType, [Validators.required]),
          required: new FormControl(question.required, [Validators.required]),
          choices: (question.choices) 
            ? new FormArray((question.choices.map(choice => {
              return new FormControl(choice, [Validators.required]);
            })))
            : new FormArray([new FormControl('', [Validators.required])]),
        });
        if (question.requirementType === 'text') {
          questionGroup.get('choices')?.disable();
        }
        questionsArray.push(questionGroup);
      }
    });
  }

  clearQuestions(): void {
    const questionsArray = this.jobQuestions.get('questions') as FormArray;
    questionsArray.clear();
  }

  onSubmit() {
    console.log(this.jobForm.value);

    if (this.jobForm.invalid) {
      this.snackBar.open('1 or more invalid fields', 'Close', {
        duration: 5000,
      });
      return;
    }

    const rye = this.reqYearsExp.value as string;
    const data = {
      jobType: 'active',
      jobDetails: {
        employer: this.jobDetails.get('employer')?.value,
        title: this.jobDetails.get('title')?.value,
        isInternship: this.jobDetails.get('isInternship')?.value,
        isFullTime: this.jobDetails.get('isFullTime')?.value,
        description: this.jobDetails.get('description')?.value,
        location: this.jobDetails.get('location')?.value,
        reqYearsExp: parseInt(rye),
        tags: this.jobDetails.get('tags')?.value,
        timeCommitment: this.jobDetails.get('timeCommitment')?.value,
        pay: this.jobDetails.get('pay')?.value,
        deadline: this.jobDetails.get('deadline')?.value,
        startDate: this.range.get('start')?.value,
        endDate: this.range.get('end')?.value,
        questions: this.jobQuestions.get('questions')?.value,
      },
    };

    if (this.isCreateJob) {
      this.addEditJobService.createJob(data).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.router.navigate(['/industry/dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open('Job successfully created!', 'Close', {
                  duration: 5000,
                });
              }
            });
          } else {
            console.log('The job was not created');
          }
        },
        error: (error: any) => {
          console.log('Create Job Failed', error);
        }
      });
    }

    this.addEditJobService.editJob({
      jobId: this.initialJobData!._id,
      ...data,
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/industry/dashboard']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open('Job successfully updated!', 'Close', {
                duration: 5000,
              });
            }
          });
        } else {
          console.log('The job was not updated.');
        }
      },
      error: (error: any) => {
        console.log('Edit Job Failed', error);
      }
    });
  }
}
