import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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
    reqYearsExp: new FormControl(null, [Validators.required]),
    // tags: new FormArray([ new FormControl('') ]),
    tags: new FormControl(''),
    timeCommitment: new FormControl(''),
    pay: new FormControl(''),
    deadline: new FormControl(null),
    // startDate: new FormControl(null),
    // endDate: new FormControl(null),
    range: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null), 
    }),
  });

  get range() {
    return this.createForm.get('range') as FormGroup;
  }

  onSubmit() {
    const data = {
      employer: this.createForm.get('employer')?.value,
      title: this.createForm.get('title')?.value,
      isInternship: this.createForm.get('isInternship')?.value,
      isFullTime: this.createForm.get('isFullTime')?.value,
      description: this.createForm.get('description')?.value,
      location: this.createForm.get('location')?.value,
      reqYearsExp: this.createForm.get('reqYearsExp')?.value,
      tags: [this.createForm.get('tags')?.value],
      timeCommitment: this.createForm.get('timeCommitment')?.value,
      pay: this.createForm.get('pay')?.value,
      deadline: this.createForm.get('deadline')?.value,
      startDate: this.range.get('start')?.value,
      endDate: this.range.get('end')?.value,
    };

    console.log(data);
  }
}
