import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student-service/student.service';
import { QuestionData } from 'app/shared/models/questionData';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplyRequestData } from '../models/applyRequestData';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { StudentProjectInfo } from '../models/student-project-info';
import { ProjectInfoCardComponent } from 'app/shared/project-info-card/project-info-card.component';

@Component({
  selector: 'app-to-post',
  templateUrl: './apply-to-post.component.html',
  styleUrls: ['./apply-to-post.component.css'],
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ProjectInfoCardComponent,
  ]
})
export class ApplyToPostComponent implements OnInit {
  isCreate: boolean = true;

  professorEmail: string;
  projectId: string;

  applicationId: string | null;

  project: StudentProjectInfo;
  questions: Array<QuestionData>;

  applyForm = this.fb.group({
    details: this.fb.group({}),
    questionsGroup: this.fb.group({
      formQuestions: this.fb.array([]),
    }),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private studentService: StudentService,
    private fb: FormBuilder,
  ) { }

  get details() {
    return this.applyForm.get('details') as FormGroup;
  }

  get questionsGroup() {
    return this.applyForm.get('questionsGroup') as FormGroup;
  }

  get formQuestions() {
    return this.applyForm.get('questionsGroup.formQuestions') as FormArray;
  }

  getCheckBoxControl(index: number, key: string): FormControl | undefined | null {
    if (this.questions[index].requirementType === 'check box') {
      const checkGroup = this.formQuestions.at(index) as FormGroup;
      return checkGroup.controls[key] as FormControl;
    } else {
      return null;
    }
  }

  requireCheckboxesToBeChecked(min = 1): ValidatorFn {
    return function validate(formGroup: AbstractControl) {
      if (formGroup instanceof FormGroup) {
        let numChecked = 0;

        Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.controls[key];
          if (control.value === true) {
            numChecked++;
          }
        });

        if (numChecked < min) {
          return { requireCheckboxesToBeChecked: true };
        }
        return null;
      }
      throw new Error('formGroup is not an instance of FormGroup');
    }
  }

  ngOnInit() {
    this.applicationId = this.route.snapshot.paramMap.get('applicationId');

    this.professorEmail = this.route.snapshot.queryParamMap.get('profEmail')!;
    this.projectId = this.route.snapshot.queryParamMap.get('oppId')!;

    this.isCreate = !this.applicationId;

    this.applyInit();
  }

  private applyInit(): void {
    this.studentService.getProjectInfo(this.professorEmail, this.projectId).subscribe({
      next: (project: StudentProjectInfo) => {
        this.project = project;

        if (this.isCreate) {
          this.questions = this.project.questions;
          this.loadQuestions(this.questions);
        } else {
          this.studentService.getApplication(this.applicationId!).subscribe({
            next: (data: any) => {
              this.questions = data.success.application.questions;
              this.loadQuestions(this.questions, true);
            },
            error: (err: any) => {
              console.log(err);
            }
          });
        }
      },
      error: (response: any) => {
        console.log('Error getting projects.');
      },
    });
  }

  private loadQuestions(
    questions: QuestionData[],
    includeAnswers = false
  ): void {
    for (let i = 0; i < questions.length; i++) {
      if (this.questions[i].requirementType === 'check box') {
        let checkControls = {};
        for (let choice of this.questions[i].choices!) {
          const value = includeAnswers
            ? this.questions[i].answers?.includes(choice) ?? false
            : false;

          checkControls = {
            ...checkControls,
            [choice]: new FormControl(value)
          };
        }
        const checkGroup = (this.questions[i].required)
          ? new FormGroup(checkControls, [this.requireCheckboxesToBeChecked(1)])
          : new FormGroup(checkControls);
        this.formQuestions.push(checkGroup);
      } else {
        const value = includeAnswers
          ? this.questions[i].answers?.at(0) ?? ''
          : '';

        const control = (this.questions[i].required)
          ? new FormControl(value, [Validators.required])
          : new FormControl(value);
        this.formQuestions.push(control);
      }
    }
  }

  onSubmit(): void {
    if (this.isCreate) {
      const data: ApplyRequestData = {
        projectID: this.projectId,
        professorEmail: this.professorEmail,
        questions: this.getAnswers(),
      };

      this.createApplication(data);
    } else {
      this.modifyApplication(this.applicationId, this.getAnswers());
    }
  }

  private getAnswers(): QuestionData[] {
    const data: QuestionData[] = [];
    for (let i = 0; i < this.questions.length; i++) {
      let question: QuestionData;
      if (this.questions[i].requirementType === 'check box') {
        const checkBoxGroup = this.formQuestions.at(i) as FormGroup;
        const answersArray: string[] = [];
        for (const [key, value] of Object.entries(checkBoxGroup.value)) {
          if (value) {
            answersArray.push(key);
          }
        }
        question = {
          ...this.questions[i],
          answers: answersArray,
        };
      } else {
        question = {
          ...this.questions[i],
          answers: [this.formQuestions.at(i).value]
        };
      }
      data.push(question);
    }

    return data;
  }

  private createApplication(data: ApplyRequestData): void {
    this.studentService.createApplication(data).subscribe({
      next: (value: any) => {
        this.router.navigate(['/student/applications-overview']).then((navigated: boolean) => {
          if (navigated) {
            this.snackBar.open('Application submitted!', 'Dismiss');
          } else {
            console.log('Problem navigating');
          }
        });
      },
      error: (err: any) => {
        this.snackBar.open('Error submitting application.', 'Dismiss');
        console.log('Error', err);
      },
    });
  }

  private modifyApplication(applicationId: any, questions: QuestionData[]): void {
    this.studentService.updateApplication(applicationId, questions).subscribe({
      next: (value: any) => {
        this.router.navigate(['/student/applications-overview']).then((navigated: boolean) => {
          if (navigated) {
            this.snackBar.open('Application modified!', 'Dismiss');
          } else {
            console.log('Problem navigating');
          }
        });
      },
      error: (err: any) => {
        this.snackBar.open('Error submitting application', 'Dismiss');
        console.log('Error', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/student/dashboard']);
  }
}
