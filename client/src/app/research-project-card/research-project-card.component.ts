import { Component, OnInit } from '@angular/core';
import { FacultyProjectService } from '../_helpers/faculty-project-service/faculty-project.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-research-project-card',
  templateUrl: './research-project-card.component.html',
  styleUrls: ['./research-project-card.component.css'],
})
export class ResearchProjectCardComponent implements OnInit {
  projects: any[] = [];
  currentProjectType: string = 'active'; // Default to the list of active projects

  constructor(
    private facultyProjectService: FacultyProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchProjects();
  }

  redirectToCreateProject() {
    //this.router.navigate(['/create-post']);
  }

  fetchProjects(): void {
    this.facultyProjectService.getProjects().subscribe({
      next: (data) => {
        this.projects = this.getProjectsByType(this.currentProjectType, data);
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }

  // Define a method to get the project data based on the project type
  getProjectsByType(type: string, data: any): any[] {
    switch (type) {
      case 'active':
        return data.success &&
          data.success.projects &&
          data.success.projects.activeProjects
          ? data.success.projects.activeProjects.projects
          : [];
      case 'archived':
        return data.success &&
          data.success.projects &&
          data.success.projects.archivedProjects
          ? data.success.projects.archivedProjects.projects
          : [];
      case 'draft':
        return data.success &&
          data.success.projects &&
          data.success.projects.draftProjects
          ? data.success.projects.draftProjects.projects
          : [];
      default:
        return [];
    }
  }

  showActiveProjectButtons: boolean = true;
  showArchivedProjectButtons: boolean = false;
  showDraftProjectButtons: boolean = false;
  // Update the current project type when a button is clicked
  updateProjectType(type: string): void {
    this.currentProjectType = type;
    if (type === 'active') {
      this.showActiveProjectButtons = true;
      this.showDraftProjectButtons = false;
      this.showArchivedProjectButtons = false;
    } else if (type === 'archived') {
      this.showArchivedProjectButtons = true;
      this.showActiveProjectButtons = false;
      this.showDraftProjectButtons = false;
    } else {
      this.showActiveProjectButtons = false;
      this.showArchivedProjectButtons = false;
      this.showDraftProjectButtons = true;
    }
    this.fetchProjects();
  }


  buttonDeleteProject(projectID: string, projectType: string): void {
    console.log(`Deleting project with ID ${projectID} and type ${projectType}`);
    this.facultyProjectService.deleteProject(projectID, projectType)
      .subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          // Handle the response if needed
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        }
      });
  }

  buttonArchiveProject(projectID: string): void {
    console.log(`Deleting project with ID ${projectID}`);
    this.facultyProjectService.archiveProject(projectID)
      .subscribe({
        next: (response) => {
          console.log('Archive response:', response);
          // Handle the response if needed
        },
        error: (error) => {
          console.error('Error archiving project:', error);
        }
      });
  }
}
