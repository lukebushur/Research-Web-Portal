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

@Component({
  selector: 'app-add-edit-job',
  templateUrl: './add-edit-job.component.html',
  styleUrls: ['./add-edit-job.component.css']
})
export class AddEditJobComponent {
  initialJobData: JobCardData;

  isCreateJob: boolean = true;

  addEditForm = new FormGroup({
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
          console.log(this.initialJobData);

          this.addEditForm.get('employer')?.setValue(this.initialJobData.employer);
          this.addEditForm.get('title')?.setValue(this.initialJobData.title);
          this.addEditForm.get('isInternship')?.setValue(this.initialJobData.isInternship);
          this.addEditForm.get('isFullTime')?.setValue(this.initialJobData.isFullTime);
          this.addEditForm.get('description')?.setValue(this.initialJobData.description);
          this.addEditForm.get('location')?.setValue(this.initialJobData.location);
          this.addEditForm.get('reqYearsExp')?.setValue(this.initialJobData.reqYearsExp);
          for (const tag of this.initialJobData.tags ?? []) {
            this.tags.push(new FormControl(tag));
          }
          this.addEditForm.get('timeCommitment')?.setValue(this.initialJobData.timeCommitment ?? null);
          this.addEditForm.get('pay')?.setValue(this.initialJobData.pay ?? null);
          const deadline = this.initialJobData.deadline ? new Date(this.initialJobData.deadline) : null;
          this.addEditForm.get('deadline')?.setValue(deadline);
          this.addEditForm.get('reqYearsExp')?.setValue(this.initialJobData.reqYearsExp);
          const startDate = this.initialJobData.startDate ? new Date(this.initialJobData.startDate) : null;
          this.range.get('start')?.setValue(startDate);
          const endDate = this.initialJobData.endDate ? new Date(this.initialJobData.endDate) : null;
          this.range.get('end')?.setValue(endDate);
        }
      }
    });
  }

  get range() {
    return this.addEditForm.get('range') as FormGroup;
  }

  get tags() {
    return this.addEditForm.get('tags') as FormArray;
  }

  get reqYearsExp() {
    return this.addEditForm.get('reqYearsExp') as FormControl;
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

  onSubmit() {
    console.log(this.addEditForm.value);

    if (this.addEditForm.invalid) {
      this.snackBar.open('1 or more invalid fields', 'Close', {
        duration: 5000,
      });
      return;
    }

    const rye = this.reqYearsExp.value as string;
    const data = {
      jobType: 'active',
      jobDetails: {
        employer: this.addEditForm.get('employer')?.value,
        title: this.addEditForm.get('title')?.value,
        isInternship: this.addEditForm.get('isInternship')?.value,
        isFullTime: this.addEditForm.get('isFullTime')?.value,
        description: this.addEditForm.get('description')?.value,
        location: this.addEditForm.get('location')?.value,
        reqYearsExp: parseInt(rye),
        tags: this.addEditForm.get('tags')?.value,
        timeCommitment: this.addEditForm.get('timeCommitment')?.value,
        pay: this.addEditForm.get('pay')?.value,
        deadline: this.addEditForm.get('deadline')?.value,
        startDate: this.range.get('start')?.value,
        endDate: this.range.get('end')?.value,
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
      jobId: this.initialJobData._id,
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
