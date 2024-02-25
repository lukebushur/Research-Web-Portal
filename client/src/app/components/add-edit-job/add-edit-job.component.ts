import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { AddEditJobService } from 'src/app/controllers/add-edit-job-controller/add-edit-job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-job',
  templateUrl: './add-edit-job.component.html',
  styleUrls: ['./add-edit-job.component.css']
})
export class AddEditJobComponent {
  addEditForm = new FormGroup({
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
    private createJobService: AddEditJobService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

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

  onSubmit() {
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

    this.createJobService.createJob(data).subscribe({
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
}
