import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableDataSharingService } from 'src/app/_helpers/table-data-sharing/table-data-sharing.service';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';

@Component({
  selector: 'app-faculty-application-list',
  templateUrl: './faculty-application-list.component.html',
  styleUrls: ['./faculty-application-list.component.css']
})
export class FacultyApplicationListComponent {
  projectId: string = "";
  projects: any[] = [];
  currentProject: any = {};

  constructor (private tableData: TableDataSharingService, private route: ActivatedRoute, private facultyProjectService: FacultyProjectService,
    private dateConverter: DateConverterService) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params["project"];
      this.fetchApplications()
    });
  }

  adjustDates(projects: any[]): void {
    projects.forEach(x => x.deadline = this.dateConverter.convertDate(x.deadline));
  }

  regenerateTableData(project: any, id: number): void {
    //this.currentId = id; //currentID is used for deciding which project is selected on the faculty dashboard
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
  }

  fetchApplications() {
    this.facultyProjectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.success.projects;
        this.adjustDates(this.projects);
        // TODO
        // This needs to auto update later
        // if (!automatic) {
        //   if (this.currentId && this.currentProject) {
        //     this.regenerateTableData(this.currentProject, this.currentId);
        //   }
        // }
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }
}
