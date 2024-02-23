import { Component } from '@angular/core';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
import { ActivatedRoute } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.css']
})

//This component is for faculty to view information about a specific applicant for a project
export class ViewApplicationComponent {
  projectID: String; //the db id for the project record
  applicantionID: String; //the db object id for the application stored in the project object
  responseData: any = -1; //the object that will store the response data

  //these are the String representations of posted, deadline, and applied time. This is necessary because the format is originally date, 
  //and needs to be converted with a service, so storing them as seperate variables makes the html cleaner.
  posted: String;
  deadline: String;
  appliedDate: String;

  //This constructor currently takes three services, faculty service for requests, activatedRoute to get the url parameters, and dateCoverter service 
  //to convert the dates into local time. The constructor body grabs the projectID and applicationID from the url parameters.
  constructor(private facultyService: FacultyProjectService, private route: ActivatedRoute, private dateConverter: DateConverterService) {
    this.route.params.subscribe(params => {
      this.projectID = params['projectID'];
      this.applicantionID = params['applicationID'];
    })
  }

  //This init makes a request to the server to get the data about a specific applicant, it then modifies the dates to the local time
  ngOnInit(): void {
    this.facultyService.fetchApplicant(this.projectID, this.applicantionID).subscribe({
      next: (data) => {
        this.responseData = data.success.responseData;
        this.posted = this.dateConverter.convertDate(this.responseData.projectData.posted);
        this.deadline = this.dateConverter.convertDate(this.responseData.projectData.deadline);
        this.appliedDate = this.dateConverter.convertDate(this.responseData.applicantData.appliedDate);
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }

  //This applicationDecision method is used to first update a students status for an application, then fetch the updated information
  applicationDecision(app: any, projectID: any, decision: string) {
    this.facultyService.applicationDecide(app, projectID, decision).subscribe({ //make request to server to update status
      next: (data) => {
        this.facultyService.fetchApplicant(this.projectID, this.applicantionID).subscribe({ //make request to server to receive updated information
          next: (response) => {
            this.responseData = response.success.responseData;
          }, 
          error: (error) => {
            console.error('Error fetching applicant', error);
          }
        });
      },
      error: (error) => {
        console.error('Error making application decision', error);
      }
    });
  }


}
