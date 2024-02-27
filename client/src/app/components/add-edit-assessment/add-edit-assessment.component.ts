import { P } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddEditAssessmentService } from 'src/app/controllers/add-edit-assessment/add-edit-assessment.service';

@Component({
  selector: 'app-add-edit-assessment',
  templateUrl: './add-edit-assessment.component.html',
  styleUrls: ['./add-edit-assessment.component.css']
})
export class AddEditAssessmentComponent {
  isCreateAssessment: boolean = true;

  assessmentForm = this.fb.group({
    name: ['', [Validators.required]],
    questionsGroup: this.fb.group({
      questions: this.fb.array([
        this.fb.group({
          question: ['', [Validators.required]],
          requirementType: ['', [Validators.required]],
          required: [true, [Validators.required]],
          choices: this.fb.array([this.fb.control('', [Validators.required])]),
        }),
      ]),
    }),
  });

  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private assessmentService: AddEditAssessmentService,
  ) { }

  ngOnInit(): void {
    const questions = this.questionsGroup.get('questions') as FormArray; 
    questions.at(0).get('choices')?.disable();
  }

  get questionsGroup() {
    return this.assessmentForm.get('questionsGroup') as FormGroup;
  }
  
  cancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    console.log(this.assessmentForm.value);
    if (this.assessmentForm.invalid) {
      console.log('Invalid Form', this.assessmentForm.value);
      return;
    }

    // this.assessmentService.createAssessment(this.assessmentForm.value).subscribe({
    //   next: (data: any) => {
    //     if (data.success) {
    //       console.log('hooray');
    //     }
    //   },
    //   error: (data: any) => {
    //     console.log('Error', data);
    //   }
    // });
  }
}
