import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentData } from 'src/app/_models/assessments/assessmentData';
import { AssessmentsService } from 'src/app/controllers/assessments-controller/assessments.service';
import { MatButtonModule } from '@angular/material/button';
import { CreateQuestionsFormComponent } from '../create-questions-form/create-questions-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-edit-assessment',
  templateUrl: './add-edit-assessment.component.html',
  styleUrls: ['./add-edit-assessment.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CreateQuestionsFormComponent,
    MatButtonModule,
    MatSnackBarModule,
  ]
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private assessmentService: AssessmentsService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const assessmentId = this.route.snapshot.paramMap.get('assessmentId');
    if (!assessmentId) {
      return;
    }

    this.isCreateAssessment = false;
    this.assessmentService.getAssessment(assessmentId).subscribe({
      next: (data: any) => {
        if (data.success) {
          const result = JSON.parse(data.success.assessment);
          result.dateCreated = new Date(result.dateCreated);
          this.initialAssessmentData = result;

          this.assessmentForm.get('name')?.setValue(this.initialAssessmentData!.name);
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

  submitCreate(submitData: any): void {
    this.assessmentService.createAssessment(submitData).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/industry/assessments']).then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Assessment successfully created!', 'Dismiss', {
                duration: 5000,
              });
            }
          });
        }
      },
      error: (data: any) => {
        console.log('Error', data);
        this.snackbar.open('Error creating assessment', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }

  submitEdit(submitData: any): void {
    const editData = {
      assessmentId: this.initialAssessmentData!._id,
      assessmentDetails: submitData,
    };
    this.assessmentService.editAssessment(editData).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/industry/assessments']).then((navigated: boolean) => {
            if (navigated) {
              this.snackbar.open('Assessment successfully updated!', 'Dismiss', {
                duration: 5000,
              });
            }
          });
        }
      },
      error: (data: any) => {
        console.log('Error', data);
        this.snackbar.open('Error updating assessment', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.assessmentForm.invalid) {
      console.log('Invalid Form', this.assessmentForm.value);
      return;
    }

    const submitData = {
      name: this.assessmentForm.value.name,
      questions: this.questionsGroup.value.questions,
    };
    if (this.isCreateAssessment) {
      this.submitCreate(submitData);
    } else {
      this.submitEdit(submitData);
    }
  }
}
