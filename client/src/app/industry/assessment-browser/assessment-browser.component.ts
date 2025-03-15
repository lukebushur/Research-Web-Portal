import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AssessmentData } from '../models/assessmentData';
import { IndustryService } from '../industry-service/industry.service';
import { AssessmentCardComponent } from '../assessment-card/assessment-card.component';

@Component({
  selector: 'app-assessment-browser',
  templateUrl: './assessment-browser.component.html',
  styleUrls: ['./assessment-browser.component.css'],
  imports: [AssessmentCardComponent]
})
export class AssessmentBrowserComponent {
  timeInterval: Subscription;

  assessments: AssessmentData[];

  constructor(
    private router: Router,
    private industryService: IndustryService,
  ) { }

  ngOnInit(): void {
    this.industryService.getAssessments().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.assessments = data.success.assessments.map((a: any) => {
            return {
              ...a,
              dateCreated: new Date(a.dateCreated),
            };
          });
        }
        console.log(this.assessments);
      },
      error: (data: any) => {
        console.log('Get jobs failed.', data.error);
      }
    });
  }
}
