import { Component } from '@angular/core';
import { FacultyProjectService } from 'app/controllers/faculty-project-controller/faculty-project.service';
import { ActivatedRoute } from '@angular/router';
import { DateConverterService } from 'app/controllers/date-converter-controller/date-converter.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.css'],
  imports: [
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})

//This component is for faculty to view information about a specific applicant for a project
export class ViewApplicationComponent {
  projectID: String; //the db id for the project record
  applicantionID: String; //the db object id for the application stored in the project object
  responseData: any = -1; //the object that will store the response data
  answersArray: any[];

  //these are the String representations of posted, deadline, and applied time. This is necessary because the format is originally date,
  //and needs to be converted with a service, so storing them as seperate variables makes the html cleaner.
  posted: String;
  deadline: String;
  appliedDate: String;

  applicationStatus = "Pending";

  //This constructor currently takes three services, faculty service for requests, activatedRoute to get the url parameters, and dateCoverter service
  //to convert the dates into local time. The constructor body grabs the projectID and applicationID from the url parameters.
  constructor(private facultyService: FacultyProjectService,
    private route: ActivatedRoute,
    private dateConverter: DateConverterService,
    public dialog: MatDialog) {
    this.route.params.subscribe(params => {
      this.projectID = params['projectID'];
      this.applicantionID = params['applicationID'];
    });
  }

  //This init makes a request to the server to get the data about a specific applicant, it then modifies the dates to the local time
  ngOnInit(): void {
    this.facultyService.fetchApplicant(this.projectID, this.applicantionID).subscribe({
      next: (data) => {
        this.responseData = data.success.responseData;
        this.posted = this.dateConverter.convertShortDate(this.responseData.projectData.posted);
        this.deadline = this.dateConverter.convertShortDate(this.responseData.projectData.deadline);
        this.appliedDate = this.dateConverter.convertShortDate(this.responseData.applicantData.appliedDate);
        this.answersArray = [];

        this.applicationStatus = this.responseData.applicantData.status == 'Accept' ? "Accepted" : (this.responseData.applicantData.status == "Reject" ? "Rejected" : "Pending")

        for (let i = 0; i < this.responseData.applicantData.answers.length; i++) {
          if (this.responseData.applicantData.answers[i].requirementType == "text") {
            this.answersArray.push(this.responseData.applicantData.answers[i].answers[0]);
          } else {
            let tempArr = [];
            for (let j = 0; j < this.responseData.applicantData.answers[i].choices.length; j++) {
              tempArr.push({
                question: this.responseData.applicantData.answers[i].choices[j],
                answer: this.getChoice(this.responseData.applicantData.answers[i], j)
              });
            }
            this.answersArray.push(tempArr);
          }
        }

        console.log(this.answersArray);
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
            this.applicationStatus = this.responseData.applicantData.status == 'Accept' ? "Accepted" : (this.responseData.applicantData.status == "Reject" ? "Rejected" : "Pending")
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

  getChoice(answer: any, index: number) {
    let index1 = answer.answers.findIndex((element: string) => element == answer.choices[index]);
    if (index1 !== -1) { return true; }
    return false;
  }

  openConfirmationDialog(app: string, projectID: any, decision: string, sentence: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: sentence } });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User clicked "Yes", perform your action here
        this.applicationDecision(app, projectID, decision);
      } else {
        // User clicked "No" or closed the dialog
      }
    });
  }
}
