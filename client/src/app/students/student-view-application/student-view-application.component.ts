import { Component } from '@angular/core';
import { StudentService } from '../student-service/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateConverterService } from 'app/shared/date-converter-controller/date-converter.service';
import { MatCardModule } from '@angular/material/card';
import { QuestionData } from 'app/shared/models/questionData';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { StudentProjectInfo } from '../models/student-project-info';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-view-application',
  templateUrl: './student-view-application.component.html',
  styleUrls: ['./student-view-application.component.css'],
  imports: [
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DatePipe,
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

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private dateConverter: DateConverterService,
    private router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.applicationID = params['applicationID'];
    });
  }

  ngOnInit(): void {
    this.studentService.getApplication(this.applicationID).subscribe({
      next: (data) => {
        this.studentService.getProjectInfo(
          data.success.application.professorEmail,
          data.success.application.opportunityId
        ).subscribe({
          next: (project: StudentProjectInfo) => {
            this.projectInfo = project;
            this.deadline = this.dateConverter.convertShortDate(this.projectInfo.deadline);
            this.posted = this.dateConverter.convertShortDate(this.projectInfo.posted);
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
