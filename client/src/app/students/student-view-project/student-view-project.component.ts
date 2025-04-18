import { AsyncPipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { StudentService } from '../student-service/student.service';
import { StudentProjectInfo } from '../models/student-project-info';
import { ProjectInfoCardComponent } from 'app/shared/project-info-card/project-info-card.component';
import { QuestionCardComponent } from "../../shared/question-card/question-card.component";

@Component({
  selector: 'app-student-view-project',
  templateUrl: './student-view-project.component.html',
  styleUrl: './student-view-project.component.css',
  imports: [
    AsyncPipe,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    ProjectInfoCardComponent,
    QuestionCardComponent,
  ]
})
export class StudentViewProjectComponent implements OnInit {

  // Project data stored in behavior subject, which requires an initial value,
  // and it emits the current value to any new subscribers.
  // It is used with the async pipe in the template (HTML) to load the page
  // content only when the data is loaded (after HTTP request finishes).
  projectData$ = new BehaviorSubject<StudentProjectInfo | null>(null);

  // URL parameters
  projectId: string;
  professorEmail: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private location: Location,
  ) {
    // assign value of URL parameters
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.professorEmail = this.route.snapshot.paramMap.get('professorEmail')!;
  }

  ngOnInit(): void {
    // Get project data.
    // The request is piped into a map to transform the data to match the
    // ProjectData interface. It also catches any errors.
    // Once transformed, projectData$ is assigned its result.
    this.studentService.getProjectInfo(
      this.professorEmail,
      this.projectId
    ).pipe(
      catchError((error: any) => {
        console.log(error);
        return of(null);
      }),
    ).subscribe({
      next: (value: StudentProjectInfo | null) => {
        if (value) {
          this.projectData$.next(value);
        }
      },
    });
  }

  // After clicking the apply button, navigate to the apply-to-project page
  // with the corresponding query parameters.
  apply() {
    this.router.navigate([
      '/student/apply-to-project',
      this.professorEmail,
      this.projectId,
    ]);
  }

  // Send the user back
  back() {
    this.location.back();
  }
}
