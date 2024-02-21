import { Component, OnInit } from '@angular/core';
import { ApplyToPostService } from 'src/app/controllers/apply-to-post/apply-to-post.service';
import { ProjectData } from '../../_models/apply-to-post/projectData';
import { QuestionData } from '../../_models/apply-to-post/questionData';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplyRequestData } from '../../_models/apply-to-post/applyRequestData';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-to-post',
  templateUrl: './apply-to-post.component.html',
  styleUrls: ['./apply-to-post.component.css'],
})
export class ApplyToPostComponent implements OnInit {
  //For side-nav opening
  opened = false;

  project: ProjectData;
  questions: Array<QuestionData>;

  applyForm: FormGroup = new FormGroup({
    formQuestions: new FormArray([]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private applyService: ApplyToPostService
  ) { }

  get formQuestions() {
    return this.applyForm.get('formQuestions') as FormArray;
  }

  getCheckBoxControl(index: number, key: string): FormControl | undefined | null {
    if (this.questions[index].requirementType === 'check box') {
      const checkGroup = this.formQuestions.at(index) as FormGroup;
      return checkGroup.controls[key] as FormControl;
    } else {
      return null;
    }
  }

  ngOnInit() {
    const profName = this.route.snapshot.queryParamMap.get('profName')!;
    const profEmail = this.route.snapshot.queryParamMap.get('profEmail')!;
    const oppId = this.route.snapshot.queryParamMap.get('oppId')!;

    this.applyService.getProjectInfo({
      professorEmail: profEmail,
      projectID: oppId,
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.project = {
            ...response.success.project,
            professorName: profName,
            professorEmail: profEmail,
            projectID: oppId,
          }
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
              this.formQuestions.push(new FormGroup(checkControls));
            } else {
              const control = (this.questions[i].required) ? new FormControl('', [Validators.required]) : new FormControl('');
              this.formQuestions.push(control);
            }
          }
          // console.log(this.project);
          // console.log(this.questions);
        }
      },
      error: (response: any) => {
        console.log('Error getting projects.');
      },
    });
  }

  categoriesString(): string {
    if (!this.project.categories || this.project.categories.length === 0) {
      return 'None';
    }
    let str = this.project.categories[0];
    for (let i = 1; i < this.project.categories.length; i++) {
      str += ', ' + this.project.categories[i];
    }
    return str;
  }

  majorsString(): string {
    if (!this.project.majors || this.project.majors.length === 0) {
      return 'None';
    }
    let str = this.project.majors[0];
    for (let i = 1; i < this.project.majors.length; i++) {
      str += ', ' + this.project.majors[i];
    }
    return str;
  }

  formatGPA(): string {
    return (Math.round(this.project.GPA * 100) / 100).toFixed(2);
  }

  dateToString(dateString: string | undefined): string {
    if (!dateString) {
      return 'None';
    }
    const date = new Date(dateString);
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
      weekday: undefined,
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return dateTimeFormat.format(date);
  }

  submitApp() {
    const data: ApplyRequestData = {
      projectID: this.project.projectID,
      professorEmail: this.project.professorEmail,
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
    console.log(data);

    this.applyService.createApplication(data).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/student-dashboard']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open('Application submitted!', 'Close', {
                duration: 5000,
              });
            } else {
              console.log('Problem navigating');
            }
          });
        }
      },
      error: (response: any) => {
        this.snackBar.open('Error submitting application.', 'Close', {
          duration: 5000,
        });
        console.log('Error', response);
      },
    });
  }
}
