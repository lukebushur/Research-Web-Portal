import { P } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentData } from 'src/app/_models/assessments/assessmentData';
import { AssessmentsService } from 'src/app/controllers/assessments-controller/assessments.service';

@Component({
  selector: 'app-add-edit-assessment',
  templateUrl: './add-edit-assessment.component.html',
  styleUrls: ['./add-edit-assessment.component.css']
})
export class AddEditAssessmentComponent {
  initialAssessmentData?: AssessmentData;
  isCreateAssessment: boolean = true;

  assessmentForm = this.fb.group({
    name: ['', [Validators.required]],
    questionsGroup: this.fb.group({
      questions: this.fb.array([]),
    }),
  });

//         this.fb.group({
//           question: ['', [Validators.required]],
//           requirementType: ['', [Validators.required]],
//           required: [true, [Validators.required]],
//           choices: this.fb.array([this.fb.control('', [Validators.required])]),
//         }),

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private assessmentService: AssessmentsService,
  ) { }

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('assessmentId');
    if (!assessmentId) {
      // const questions = this.questionsGroup.get('questions') as FormArray; 
      // questions.at(0).get('choices')?.disable();
      return;
    }

    this.isCreateAssessment = false;
    this.assessmentService.getAssessment(assessmentId).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.initialAssessmentData = JSON.parse(data.success.assessment);
          this.initialAssessmentData!.dateCreated = new Date(this.initialAssessmentData!.dateCreated);
          console.log(this.initialAssessmentData);

          this.assessmentForm.get('name')?.setValue(this.initialAssessmentData!.name);

          // this.addEditForm.get('employer')?.setValue(this.initialJobData.employer);
          // this.addEditForm.get('title')?.setValue(this.initialJobData.title);
          // this.addEditForm.get('isInternship')?.setValue(this.initialJobData.isInternship);
          // this.addEditForm.get('isFullTime')?.setValue(this.initialJobData.isFullTime);
          // this.addEditForm.get('description')?.setValue(this.initialJobData.description);
          // this.addEditForm.get('location')?.setValue(this.initialJobData.location);
          // this.addEditForm.get('reqYearsExp')?.setValue(this.initialJobData.reqYearsExp);
          // for (const tag of this.initialJobData.tags ?? []) {
          //   this.tags.push(new FormControl(tag));
          // }
          // this.addEditForm.get('timeCommitment')?.setValue(this.initialJobData.timeCommitment ?? null);
          // this.addEditForm.get('pay')?.setValue(this.initialJobData.pay ?? null);
          // const deadline = this.initialJobData.deadline ? new Date(this.initialJobData.deadline) : null;
          // this.addEditForm.get('deadline')?.setValue(deadline);
          // this.addEditForm.get('reqYearsExp')?.setValue(this.initialJobData.reqYearsExp);
          // const startDate = this.initialJobData.startDate ? new Date(this.initialJobData.startDate) : null;
          // this.range.get('start')?.setValue(startDate);
          // const endDate = this.initialJobData.endDate ? new Date(this.initialJobData.endDate) : null;
          // this.range.get('end')?.setValue(endDate);
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      }
    });
  }

  get questionsGroup() {
    return this.assessmentForm.get('questionsGroup') as FormGroup;
  }

  cancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    console.log(this.assessmentForm.value);
    console.log(this.questionsGroup.value);
    
    if (this.assessmentForm.invalid) {
      console.log('Invalid Form', this.assessmentForm.value);
      return;
    }

    this.assessmentService.createAssessment({
      name: this.assessmentForm.value.name,
      questions: this.questionsGroup.value.questions,
    }).subscribe({
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
