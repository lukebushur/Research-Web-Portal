import { Component, OnInit,  } from '@angular/core';
import { FacultyProjectService } from '../_helpers/faculty-project-service/faculty-project.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TableDataSharingService } from '../_helpers/table-data-sharing/table-data-sharing.service'

@Component({
  selector: 'app-research-project-card',
  templateUrl: './research-project-card.component.html',
  styleUrls: ['./research-project-card.component.css'],
})
export class ResearchProjectCardComponent implements OnInit {
  projects: any[] = [];
  selected: boolean[] = [];
  currentProjectType: string = 'active'; // Default to the list of active projects
  repeat: any;
  currentId: number;
  currentProject: any;

  constructor(
    private facultyProjectService: FacultyProjectService,
    private router: Router,
    private tableData: TableDataSharingService
  ) { }

  ngOnInit(): void {
    this.fetchProjects(false);
    this.repeat = setInterval(() => {
      this.fetchProjects(true);
    }, 5000); 
  }

  doSomething(project: any, id: number): void {
    this.currentId = id;
    this.currentProject = project;
    let applications: any[] = [];

    project.applications.forEach((x: any) => {
      let y: any = {};
      y.name = x.name;
      y.gpa = x.gpa;
      y.major = x.major;
      y.email = x.email;
      y.status = x.status;
      applications.push(y);
    });
    console.log(applications);

    this.tableData.projectID = project.id;
    this.tableData.updateData(applications);

    this.unselectAll();
    this.selected[id] = true;
  }

  redirectToCreateProject() {
    //this.router.navigate(['/create-post']);
  }

  unselectAll() {
    for (let x: number = 0; x < this.selected.length; x++) {
      this.selected[x] = false;
    }
  }

  fetchProjects(automatic: boolean): void {
    this.facultyProjectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.success.projects;
        console.log(this.projects);
        if (!automatic) {
          for (let x: number = 0; x < this.projects.length; x++) {
            this.selected[x] = false;
          }
          if(this.currentId && this.currentProject) {
            this.doSomething(this.currentProject, this.currentId);
          }
        }
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
    // if (type === 'active') {
    //   this.showActiveProjectButtons = true;
    //   this.showDraftProjectButtons = false;
    //   this.showArchivedProjectButtons = false;
    // } else if (type === 'archived') {
    //   this.showArchivedProjectButtons = true;
    //   this.showActiveProjectButtons = false;
    //   this.showDraftProjectButtons = false;
    // } else {
    //   this.showActiveProjectButtons = false;
    //   this.showArchivedProjectButtons = false;
    //   this.showDraftProjectButtons = true;
    // }
    //this.fetchProjects();
    this.tableData.updateData([]);
  }


  buttonDeleteProject(projectID: string, projectType: string): void {
    console.log(`Deleting project with ID ${projectID} and type ${projectType}`);
    this.facultyProjectService.deleteProject(projectID, projectType)
      .subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          this.fetchProjects(false);
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
          this.fetchProjects(false);
          // Handle the response if needed
        },
        error: (error) => {
          console.error('Error archiving project:', error);
        }
      });
  }
}
