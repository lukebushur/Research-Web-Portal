import { P } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddEditAssessmentService } from 'src/app/controllers/add-edit-assessment/add-edit-assessment.service';

interface RequirementOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-add-edit-assessment',
  templateUrl: './add-edit-assessment.component.html',
  styleUrls: ['./add-edit-assessment.component.css']
})
export class AddEditAssessmentComponent {
  isCreateAssessment: boolean = true;

  reqTypes: RequirementOption[] = [
    {
      name: 'Text',
      value: 'text'
    },
    {
      name: 'Single Select',
      value: 'radio button'
    },
    {
      name: 'Multiple Select',
      value: 'check box'
    },
  ];

  assessmentForm = this.fb.group({
    name: ['', [Validators.required]],
    questions: this.fb.array([
      this.fb.group({
        question: ['', [Validators.required]],
        requirementType: ['', [Validators.required]],
        required: [true, [Validators.required]],
        choices: this.fb.array([this.fb.control('', [Validators.required])]),
      }),
    ]),
  });

  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private assessmentService: AddEditAssessmentService,
  ) { }

  ngOnInit(): void {
    this.questions.at(0).get('choices')?.disable();
  }

  get questions() {
    return this.assessmentForm.get('questions') as FormArray;
  }
  
  getQuestionChoices(index: number) {
    const questionGroup = this.questions.at(index) as FormGroup;
    return questionGroup.get('choices') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      question: ['', Validators.required],
      requirementType: ['', Validators.required],
      required: [true, [Validators.required]],
      choices: this.fb.array([this.fb.control('', [Validators.required])]),
    })
    questionGroup.get('choices')?.disable();
    this.questions.push(questionGroup);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  updateQuestion(index: number) {
    if (this.questions.at(index).get('requirementType')?.value === 'text') {
      this.getQuestionChoices(index).disable();
    } else {
      this.getQuestionChoices(index).enable();
    }
  }

  addChoice(index: number) {
    this.getQuestionChoices(index).push(this.fb.control('', [Validators.required]));
  }

  removeChoice(qindex: number, cindex: number) {
    this.getQuestionChoices(qindex).removeAt(cindex);
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

    this.assessmentService.createAssessment(this.assessmentForm.value).subscribe({
      next: (data: any) => {
        if (data.success) {
          console.log('hooray');
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      }
    });
  }
}
