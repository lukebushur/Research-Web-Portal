import { Component } from '@angular/core';
import { StudentDashboardService } from 'app/controllers/student-dashboard-controller/student-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateConverterService } from 'app/controllers/date-converter-controller/date-converter.service';
import { MatCardModule } from '@angular/material/card';
import { QuestionData } from 'app/_models/projects/questionData';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-student-view-application',
  templateUrl: './student-view-application.component.html',
  styleUrls: ['./student-view-application.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SpinnerComponent
  ]
})
export class StudentViewApplicationComponent {

  applicationID: string;
  applicationData: any = -1;
  projectInfo: any = -1;

  questions: QuestionData[];

  posted: String;
  deadline: String;
  appliedDate: String;

  constructor(private studentService: StudentDashboardService, private route: ActivatedRoute, private dateConverter: DateConverterService,
    private router: Router) {
    this.route.params.subscribe(params => {
      this.applicationID = params['applicationID'];
    });
  }

  ngOnInit(): void {
    this.studentService.getApplication(this.applicationID).subscribe({
      next: (data) => {
        this.studentService.getProjectInfo(data.success.application.professorEmail, data.success.application.opportunityId).subscribe({
          next: (data1) => {
            this.projectInfo = data1.success.project;
            this.deadline = this.dateConverter.convertShortDate(this.projectInfo.deadline);
            this.posted = this.dateConverter.convertShortDate(this.projectInfo.posted);
            // console.log('Project', this.projectInfo);
          },
          error: (error) => {
            this.projectInfo = null;
            this.router.navigate(['/student/applications-overview'], {
            });
          }
        })

        this.applicationData = data.success.application;
        this.appliedDate = this.dateConverter.convertShortDate(this.applicationData.appliedDate);
        this.questions = this.applicationData.questions;
        // console.log('Application', this.applicationData);
        // console.log('Questions', this.questions);
      },
      error: (error) => {
        console.error('Error fetching projects', error);
        this.router.navigate(['/student/applications-overview'], {
        });
      },
    })
  }

  rescindApplication(applicationID: string) {
    this.studentService.deleteApplication(applicationID).subscribe({
      next: (data: any) => {
        this.router.navigate(['/student/applications-overview'], {
        });
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }
}
