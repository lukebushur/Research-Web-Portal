import { Component, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssessmentData } from 'src/app/_models/assessments/assessmentData';
import { AssessmentsService } from 'src/app/controllers/assessments-controller/assessments.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class AssessmentCardComponent {
  @Input() assessmentData: AssessmentData;

  constructor(
    private router: Router,
    private assessmentsService: AssessmentsService,
    private snackbar: MatSnackBar,
  ) { }

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
    this.assessmentsService.deleteAssessment(this.assessmentData._id).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.snackbar.open('Assessment successfully deleted!', 'Dismiss', {
            duration: 5000,
          });
        }
      },
      error: (data: any) => {
        console.log('Error', data);
        this.snackbar.open('Error deleting assessment', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }
}
