import { Component, OnInit, ViewChildren, ViewContainerRef } from '@angular/core';
import { ApplyToPostService } from 'src/app/controllers/apply-to-post/apply-to-post.service';
import { ProjectData } from '../../_models/apply-to-post/projectData';
import { QuestionData } from '../../_models/apply-to-post/questionData';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplyRequestData } from '../../_models/apply-to-post/applyRequestData';

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

  constructor(private applyService: ApplyToPostService) { }

  get formQuestions() {
    return this.applyForm.get('formQuestions') as FormArray;
  }

  getCheckBoxControl(index: number, key: string): FormControl | null {
    if (this.questions[index].requirementType === 'check box') {
      const checkGroup =  this.formQuestions.at(index) as FormGroup;
      return checkGroup.controls[key] as FormControl;
    } else {
      return null;
    }
  }

  ngOnInit() {
    this.applyService.getProjects().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.project = response.success.data[0];
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
                console.log(checkControls);
              }
              this.formQuestions.push(new FormGroup(checkControls));
            } else {
              const control = (this.questions[i].required) ? new FormControl('', [Validators.required]) : new FormControl('');
              this.formQuestions.push(control);
            }
          }
          // console.log(this.project);
          console.log(this.questions);
        }
      },
      error: (response: any) => {
        console.log('Error getting projects.');
      },
    });
  }

  categoriesString(): string {
    let str = this.project.categories[0];
    for (let i = 1; i < this.project.categories.length; i++) {
      str += ', ' + this.project.categories[i];
    }
    return str;
  }

  majorsString(): string {
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
          console.log(response);
          
        }
      },
      error: (response: any) => {
        console.log('Error creating application');
        console.log(response);
      },
    });
  }
}
