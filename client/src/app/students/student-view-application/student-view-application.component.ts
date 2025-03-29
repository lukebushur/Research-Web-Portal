import { Component } from '@angular/core';
import { StudentService } from '../student-service/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { StudentProjectInfo } from '../models/student-project-info';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ProjectInfoCardComponent } from 'app/shared/project-info-card/project-info-card.component';
import { QuestionCardComponent } from "../../shared/question-card/question-card.component";
import { LargeApplicationStatusComponent } from "../../shared/large-application-status/large-application-status.component";

@Component({
  selector: 'app-student-view-application',
  templateUrl: './student-view-application.component.html',
  styleUrls: ['./student-view-application.component.css'],
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    DatePipe,
    ProjectInfoCardComponent,
    QuestionCardComponent,
    LargeApplicationStatusComponent,
  ]
})
export class StudentViewApplicationComponent {

  applicationId: string;

  professorEmail$ = new BehaviorSubject<string | null>(null);
  applicationData$ = new BehaviorSubject<any | null>(null);
  projectInfo$ = new BehaviorSubject<StudentProjectInfo | null>(null);

  constructor(
    private studentService: StudentService,
    route: ActivatedRoute,
    private router: Router,
  ) {
    this.applicationId = route.snapshot.paramMap.get('applicationID')!;
  }

  ngOnInit(): void {
    this.studentService.getApplication(this.applicationId).subscribe({
      next: (data) => {
        this.professorEmail$.next(data.success.application.professorEmail);

        this.studentService.getProjectInfo(
          data.success.application.professorEmail,
          data.success.application.opportunityId
        ).subscribe({
          next: (project: StudentProjectInfo) => {
            this.projectInfo$.next(project);
          },
          error: (error) => {
            this.router.navigate(['/student/applications-overview']);
          }
        })

        this.applicationData$.next(data.success.application);
      },
      error: (error) => {
        console.error('Error fetching projects', error);
        this.router.navigate(['/student/applications-overview']);
      },
    })
  }

  rescindApplication(applicationID: string) {
    this.studentService.deleteApplication(applicationID).subscribe({
      next: (data: any) => {
        this.router.navigate(['/student/applications-overview']);
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }
}
