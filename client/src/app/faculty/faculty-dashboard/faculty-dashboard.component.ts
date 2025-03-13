import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { AppliedStudentTableComponent } from '../applied-student-table/applied-student-table.component';
import { ResearchProjectCardComponent } from '../research-project-card/research-project-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FacultyService } from '../faculty-service/faculty.service';
import { ProjectFetchData } from '../models/projectFetchData';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Application } from 'app/shared/models/application';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// interface for containing the projects according to their types
interface ProjectsObj {
  active: ProjectFetchData[],
  draft: ProjectFetchData[],
  archived: ProjectFetchData[]
}

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css'],
  imports: [
    ResearchProjectCardComponent,
    AppliedStudentTableComponent,
    SpinnerComponent,
    MatTabsModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ]
})

export class FacultyDashboardComponent implements OnInit {
  // for holding the fetched projects and notifying subscribers of changes
  projects$ = new BehaviorSubject<ProjectsObj | null>(null);
  // for holding the currently selected project index and notifying subscribers of changes
  selectedIndex$ = new BehaviorSubject<number>(-1);
  // for holding the currently selected project object and notifying subscribers of changes
  selectedProject$ = new BehaviorSubject<ProjectFetchData | null>(null);

  constructor(
    private router: Router,
    private facultyService: FacultyService,
  ) { }

  ngOnInit(): void {
    this.fetchProjects();
  }

  // fetch projects from the server and update the subject's value
  fetchProjects(selectedIndex?: number): void {
    this.facultyService.getProjects().subscribe({
      next: (data: any) => {
        if (data.success) {
          const projects: ProjectFetchData[] = data.success.projects.map((project: any) => {
            const projectResult: ProjectFetchData = {
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
            // if an initial selected index is specified, update the subjects with
            // the corresponding data
            if (selectedIndex && selectedIndex === project.number) {
              this.updatedSelected(selectedIndex, projectResult);
            }
            return projectResult;
          });

          // construct the object with the project data
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
          // Update the subject with the new data
          this.projects$.next(projectsObj);
        }
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }

  // update the selected subjects with the specified values
  updatedSelected(num: number, project: ProjectFetchData | null): void {
    this.selectedIndex$.next(num);
    this.selectedProject$.next(project);
  }

  // this is called whenever a project is archived and deleted
  // deselects the project if it is the same as the project being deleted and
  // fetches projects from the server again
  updateProjects(projectNumber: number): void {
    if (this.selectedIndex$.getValue() === projectNumber) {
      this.updatedSelected(-1, null);
    }
    this.fetchProjects();
  }

  createNewProject() {
    this.router.navigate(['/faculty/create-project']);
  }
}
