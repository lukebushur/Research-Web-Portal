import { AsyncPipe, DatePipe, DecimalPipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { QuestionData } from 'app/_models/projects/questionData';
import { StudentDashboardService } from 'app/controllers/student-dashboard-controller/student-dashboard.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

// interface for storing project data
interface ProjectData {
  projectName: string;
  professorName: string;
  description: string;
  responsibilities: string;
  categories: string[];
  posted: Date;
  GPA: number;
  majors: string[];
  deadline: Date;
  questions: QuestionData[];
}

@Component({
  selector: 'app-student-view-project',
  templateUrl: './student-view-project.component.html',
  styleUrl: './student-view-project.component.css',
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    SpinnerComponent,
  ]
})
export class StudentViewProjectComponent implements OnInit {

  // Project data stored in behavior subject, which requires an initial value,
  // and it emits the current value to any new subscribers.
  // It is used with the async pipe in the template (HTML) to load the page
  // content only when the data is loaded (after HTTP request finishes).
  projectData$ = new BehaviorSubject<ProjectData | null>(null);

  // URL parameters
  projectId: string;
  professorEmail: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentDashboardService,
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
      map((data: any) => {
        const projectData = data.success.project;
        return <ProjectData>{
          ...projectData,
          posted: new Date(projectData.posted),
          deadline: new Date(projectData.deadline),
        };
      }),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      }),
    ).subscribe(this.projectData$);
  }

  // Return a more understandable string for displaying what the given question
  // requirementType is
  displayRequirementType(reqType: string): string {
    if (reqType === 'text') {
      return 'Text Response';
    } else if (reqType === 'radio button') {
      return 'Single Select';
    } else if (reqType === 'check box') {
      return 'Multiple Select';
    }
    return 'Invalid Question Type';
  }

  // After clicking the apply button, navigate to the apply-to-project page
  // with the corresponding query parameters.
  apply() {
    this.router.navigate(['/student/apply-to-project'], {
      queryParams: {
        profName: this.projectData$.getValue()!.professorName,
        profEmail: this.professorEmail,
        oppId: this.projectId
      }
    });
  }

  // Send the user back
  back() {
    this.location.back();
  }
}
