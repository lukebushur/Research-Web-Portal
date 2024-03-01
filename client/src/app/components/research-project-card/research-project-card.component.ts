import { Component, OnInit, } from '@angular/core';
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TableDataSharingService } from '../../_helpers/table-data-sharing/table-data-sharing.service'
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';

@Component({
  selector: 'app-research-project-card',
  templateUrl: './research-project-card.component.html',
  styleUrls: ['./research-project-card.component.css'],
})
export class ResearchProjectCardComponent implements OnInit {
  projects: any[] = []; //Array of projects, this will be used to generate each project card
  selected: boolean[] = []; //an array of booleans to determine which project is currently selected
  currentProjectType: string = 'active'; // Default to the list of active projects
  currentId: number; //each project card has an id, starting from 0, and it is used to index the selected array for which card to highlight and generate applicants for
  currentProject: any; //the project object of the currently selected project. Has information such as gpa requirement, applicants, post date, etc.

  //These bools are used to decide which project type is being selected
  showActiveProjectButtons: boolean = true;
  showArchivedProjectButtons: boolean = false;
  showDraftProjectButtons: boolean = false;

  constructor(
    private facultyProjectService: FacultyProjectService,
    private router: Router,
    private tableData: TableDataSharingService,
    private dateConverter: DateConverterService
  ) { }

  ngOnInit(): void {
    this.fetchProjects(false);
  }

  //This method regenerates the table data for each of the project cards, it takes the database projectID, and the integer number "id" of 
  //the same project that will have its data displayed by a table.
  regenerateTableData(project: any, id: number): void {
    this.currentId = id; //currentID is used for deciding which project is selected on the faculty dashboard
    this.currentProject = project; //this is the database object of the project, and is updated from the parameter
    let applications: any[] = []; //array of application that will be displayed by the table

    project.applications.forEach((x: any) => { //for loop to set up the data for each table entry
      let y: any = {};
      y.name = x.name;
      y.GPA = x.GPA;
      y.major = x.major;
      y.email = x.email;
      y.status = x.status;
      y.application = x.application;
      y.project = project.id;
      applications.push(y);
    });

    this.tableData.setProjectID(project.id); //sets the table data
    this.tableData.updateData(applications, project.id);
    this.unselectAll(); //This "unselects" all other project cards
    this.selected[id] = true; //This selects the specified project card
  }

  redirectToCreateProject() {
    this.router.navigate(['/faculty/create-post/Active/new']);
  }

  unselectAll() { //This method unselects all of the project cards, is used when switching between active/draft/archived projects
    for (let x: number = 0; x < this.selected.length; x++) {
      this.selected[x] = false;
    }
  }

  //This method fetches the projects from the database and then regenerates table data, the automatic parameter is used to 
  //determine if the method is being ran automatically and can be ignored unless it will be used for a live demo. It basically
  //is used to decide whether to unselect the currently selected projec card or not.
  fetchProjects(automatic: boolean): void {
    this.facultyProjectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.success.projects;
        this.adjustDates(this.projects);
        if (!automatic) {
          for (let x: number = 0; x < this.projects.length; x++) {
            this.selected[x] = false;
          }
          if (this.currentId && this.currentProject) {
            this.regenerateTableData(this.currentProject, this.currentId);
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

  // Update the current project type when a button is clicked
  updateProjectType(type: string): void {
    this.currentProjectType = type;
    this.tableData.updateData([], -1);
  }

  buttonUpdateProject(projectID: string, projectType: string): void {
    this.router.navigate([`/faculty/create-post/${projectType}/${projectID}`]);
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

  adjustDates(projects: any[]): void {
    projects.forEach(x => x.deadline = this.dateConverter.convertDate(x.deadline));
  }
}
