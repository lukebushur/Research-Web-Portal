import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { CreateJobService } from 'src/app/controllers/create-job-controller/create-job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent {
  createForm = new FormGroup({
    employer: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    isInternship: new FormControl(null, [Validators.required]),
    isFullTime: new FormControl(null, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    reqYearsExp: new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/)]),
    tags: new FormArray([]),
    timeCommitment: new FormControl(''),
    pay: new FormControl(''),
    deadline: new FormControl(null),
    range: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null), 
    }),
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private announcer: LiveAnnouncer,
    private createJobService: CreateJobService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  get range() {
    return this.createForm.get('range') as FormGroup;
  }

  get tags() {
    return this.createForm.get('tags') as FormArray;
  }

  get reqYearsExp() {
    return this.createForm.get('reqYearsExp') as FormControl;
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

  onSubmit() {
    if (this.createForm.invalid) {
      this.snackBar.open('1 or more invalid fields', 'Close');
      return;
    }

    const rye = this.reqYearsExp.value as string;
    const data = {
      jobType: 'active',
      jobDetails: {
        employer: this.createForm.get('employer')?.value,
        title: this.createForm.get('title')?.value,
        isInternship: this.createForm.get('isInternship')?.value,
        isFullTime: this.createForm.get('isFullTime')?.value,
        description: this.createForm.get('description')?.value,
        location: this.createForm.get('location')?.value,
        reqYearsExp: parseInt(rye),
        tags: this.createForm.get('tags')?.value,
        timeCommitment: this.createForm.get('timeCommitment')?.value,
        pay: this.createForm.get('pay')?.value,
        deadline: this.createForm.get('deadline')?.value,
        startDate: this.range.get('start')?.value,
        endDate: this.range.get('end')?.value,
      },
    };

    console.log(data);

    this.createJobService.createJob(data).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/industry/dashboard']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open('Job successfully created!', 'Close');
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
}
