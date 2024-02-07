import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';

//Interface for an entries to the applied student table
export interface detailedAppliedStudentList {
  name: string;
  gpa: number;
  degree: string;
  email: string;
  application: string;
  status: string;
}

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})

export class ViewProjectComponent {

  projectID: string = "";
  projectType: string = "";
  projectName: string = "";
  

  constructor(private facultyService: FacultyProjectService, private route: ActivatedRoute, private dateConverter: DateConverterService) {
    this.route.params.subscribe(params => {
      this.projectType = params['projectType'];
      this.projectID = params['projectID']; //grab projectID from url parameter
      //Get project data from database
      this.facultyService.getProject(this.projectID, this.projectType).subscribe({
        next: (data) => {
          this.projectName = data.success.project.projectName;
          
        },
        error: (error) => {
          console.error('Error fetching projects', error);
        },
      });
      //Get application data from database
      this.facultyService.demoFetchApplicants(this.projectID).subscribe({

      })
    });
  }

} 
