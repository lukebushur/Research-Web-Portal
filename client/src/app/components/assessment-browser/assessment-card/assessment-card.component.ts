import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentData } from 'src/app/_models/assessments/assessmentData';
import { AssessmentsService } from 'src/app/controllers/assessments-controller/assessments.service';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.css']
})
export class AssessmentCardComponent {
  @Input() assessmentData: AssessmentData;

  constructor(private router: Router, private assessmentsService: AssessmentsService) { }

  dateToString(date: Date): string {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', { weekday: undefined, year: 'numeric', month: 'short', day: 'numeric' });
    return dateTimeFormat.format(date);
  }

  topQuestions(): string[] {
    const questions: string[] = [];
    for (let i = 0; i < 3; i++) {
      if (i < this.assessmentData.questions.length) {
        questions.push(this.assessmentData.questions[i].question);      
      } else {
        questions.push('');
      }
    }
    return questions;
  }

  editAssessment(): void {
    this.router.navigate([`/industry/edit-assessment/${this.assessmentData._id}`]);
  }

  deleteAssessment(): void {

  }
}
