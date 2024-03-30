import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AppliedStudentTableComponent } from '../applied-student-table/applied-student-table.component';
import { ResearchProjectCardComponent } from '../research-project-card/research-project-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
import { ProjectFetchData } from 'src/app/_models/projects/projectFetchData';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Application } from 'src/app/_models/applications/application';

interface ProjectsObj {
  active: ProjectFetchData[],
  draft: ProjectFetchData[],
  archived: ProjectFetchData[]
}

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css'],
  standalone: true,
  imports: [
    ResearchProjectCardComponent,
    AppliedStudentTableComponent,
    SpinnerComponent,
    MatTabsModule,
    AsyncPipe,
  ]
})

export class FacultyDashboardComponent implements OnInit {
  
  projects$ = new BehaviorSubject<ProjectsObj | null>(null);
  selectedIndex$ = new BehaviorSubject<number>(-1);
  selectedProject$ = new BehaviorSubject<ProjectFetchData | null>(null);
  
  constructor(private facultyService: FacultyProjectService) { }

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.facultyService.getProjects().subscribe({
      next: (data: any) => {
        if (data.success) {
          const projects: ProjectFetchData[] = data.success.projects.map((project: any) => {
            return <ProjectFetchData>{
              ...project,
              posted: new Date(project.posted),
              deadline: new Date(project.deadline),
              applications: project.applications.map((application: any) => {
                return <Application>{
                  ...application,
                  appliedDate: new Date(application.appliedDate),
                };
              }),
            };
          });
          
          const projectsObj: ProjectsObj = {
            active: [],
            draft: [],
            archived: []
          };
          for (const project of projects) {
            if (project.projectType === 'active') {
              projectsObj.active.push(project);
            } else if (project.projectType === 'draft') {
              projectsObj.draft.push(project);
            } else {
              projectsObj.archived.push(project);
            }
          }
          this.projects$.next(projectsObj);
          this.projects$.subscribe(p => {
            console.log(p);
          });
        }
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }

  updateProjects(projectNumber: number): void {
    console.log('Project ' + projectNumber + ' changed.');
    if (this.selectedIndex$.getValue() === projectNumber) {
      this.selectedIndex$.next(-1);
      this.selectedProject$.next(null);
    }
    this.fetchProjects();
  }
}