import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { AssessmentData } from 'src/app/_models/assessments/assessmentData';
import { AssessmentsService } from 'src/app/controllers/assessments-controller/assessments.service';

@Component({
  selector: 'app-assessment-browser',
  templateUrl: './assessment-browser.component.html',
  styleUrls: ['./assessment-browser.component.css']
})
export class AssessmentBrowserComponent {
  timeInterval: Subscription;

  assessments: AssessmentData[];
  
  constructor(private router: Router, private assessmentsService: AssessmentsService) { }

  ngOnInit(): void {
    this.timeInterval = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.assessmentsService.getAssessments())
    ).subscribe({
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

  ngOnDestroy(): void {
    this.timeInterval.unsubscribe();
  }
}
