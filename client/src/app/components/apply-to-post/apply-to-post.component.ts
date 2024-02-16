import { Component, OnInit, ViewChildren, ViewContainerRef } from '@angular/core';
import { ApplyToPostService } from 'src/app/controllers/apply-to-post/apply-to-post.service';
import { ProjectData } from './projectData';
import { QuestionData } from './questionData';
import { ApplyFormQuestionComponent } from './apply-form-question/apply-form-question.component';

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

  @ViewChildren('app-text-field', { read: ViewContainerRef })
  answer!: ViewContainerRef;

  constructor(private applyService: ApplyToPostService) { }

  ngOnInit() {
    this.applyService.getProjects().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.project = response.success.data[0];
          this.questions = this.project.questions;

          console.log(this.project);
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

  submitApp(id: any) {
    console.log(this.answer);
  }
}
