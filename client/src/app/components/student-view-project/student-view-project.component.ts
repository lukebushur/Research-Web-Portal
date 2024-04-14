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
import { QuestionData } from 'src/app/_models/projects/questionData';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { SpinnerComponent } from '../spinner/spinner.component';

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
  standalone: true,
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
  ],
  templateUrl: './student-view-project.component.html',
  styleUrl: './student-view-project.component.css'
})
export class StudentViewProjectComponent implements OnInit {

  projectData$ = new BehaviorSubject<ProjectData | null>(null);
  projectId: string;
  projectType: string;
  professorEmail: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentDashboardService,
    private location: Location,
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.professorEmail = this.route.snapshot.paramMap.get('professorEmail')!;
  }

  ngOnInit(): void {
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

  apply() {
    this.router.navigate(['/student/apply-to-project'], {
      queryParams: {
        profName: this.projectData$.getValue()!.professorName,
        profEmail: this.professorEmail,
        oppId: this.projectId
      }
    });
  }

  back() {
    // Send the user back!
    this.location.back();
  }
}
