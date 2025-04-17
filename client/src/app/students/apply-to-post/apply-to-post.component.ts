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
  //For side-nav opening
  opened = false;

  professorEmail: string;
  projectId: string;

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
    const profName = this.route.snapshot.queryParamMap.get('profName')!;
    this.professorEmail = this.route.snapshot.queryParamMap.get('profEmail')!;
    this.projectId = this.route.snapshot.queryParamMap.get('oppId')!;

    this.studentService.getProjectInfo(this.professorEmail, this.projectId).subscribe({
      next: (project: StudentProjectInfo) => {
        this.project = project;

        this.questions = this.project.questions;

        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].questionNum = i + 1;
          if (this.questions[i].requirementType === 'check box') {
            let checkControls = {};
            for (let choice of this.questions[i].choices!) {
              checkControls = {
                ...checkControls,
                [choice]: new FormControl(false)
              };
            }
            const checkGroup = (this.questions[i].required)
              ? new FormGroup(checkControls, [this.requireCheckboxesToBeChecked(1)])
              : new FormGroup(checkControls);
            this.formQuestions.push(checkGroup);
          } else {
            const control = (this.questions[i].required)
              ? new FormControl('', [Validators.required])
              : new FormControl('');
            this.formQuestions.push(control);
          }

        }
      },
      error: (response: any) => {
        console.log('Error getting projects.');
      },
    });
  }


  onSubmit() {
    const data: ApplyRequestData = {
      projectID: this.projectId,
      professorEmail: this.professorEmail,
      questions: [],
    };
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
          answers: answersArray
        };
      } else {
        question = {
          ...this.questions[i],
          answers: [this.formQuestions.at(i).value]
        };
      }
      delete question.questionNum;
      data.questions.push(question);
    }

    this.studentService.createApplication(data).subscribe({
      next: (response: any) => {
        this.router.navigate(['/student/applications-overview']).then((navigated: boolean) => {
          if (navigated) {
            this.snackBar.open('Application submitted!', 'Close');
          } else {
            console.log('Problem navigating');
          }
        });
      },
      error: (response: any) => {
        this.snackBar.open('Error submitting application.', 'Close');
        console.log('Error', response);
      },
    });
  }

  cancel() {
    this.router.navigate(['/student/dashboard']);
  }
}
