import { Component, OnInit } from '@angular/core';
import { FacultyService } from '../faculty-service/faculty.service';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ApplicantData, ApplicantProjectData } from '../models/view-applicant';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ProjectInfoCardComponent } from 'app/shared/project-info-card/project-info-card.component';
import { QuestionCardComponent } from "../../shared/question-card/question-card.component";
import { LargeApplicationStatusComponent } from "../../shared/large-application-status/large-application-status.component";

// This component is for faculty to view information about a specific applicant
// for a project.
@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.css'],
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ProjectInfoCardComponent,
    QuestionCardComponent,
    LargeApplicationStatusComponent,
  ]
})
export class ViewApplicationComponent implements OnInit {
  projectId: string; // the ID for the project record
  applicantionId: string; // the ID for the application

  projectData$ = new BehaviorSubject<ApplicantProjectData | null>(null);
  applicantData$ = new BehaviorSubject<ApplicantData | null>(null);

  // This constructor currently takes two services:
  //   FacultyService for requests,
  //   ActivatedRoute to get the url parameters.
  // The constructor body grabs the projectId and applicationId from the url
  // parameters.
  constructor(
    private facultyService: FacultyService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.projectId = this.route.snapshot.paramMap.get('projectID')!;
    this.applicantionId = this.route.snapshot.paramMap.get('applicationID')!;
  }

  // makes a request to the server to get the data about a specific applicant.
  ngOnInit(): void {
    this.facultyService.fetchApplicant(
      this.projectId,
      this.applicantionId
    ).subscribe({
      next: (data) => {
        this.projectData$.next(data.projectData);
        this.applicantData$.next(data.applicantData);
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }

  // first, update a student's status for an application;
  // second, fetch the updated information
  applicationDecision(app: any, projectID: any, decision: string): void {
    // make request to server to update status
    this.facultyService.applicationDecide(app, projectID, decision).subscribe({
      next: () => {
        // make request to server to receive updated information
        this.facultyService.fetchApplicant(
          this.projectId,
          this.applicantionId
        ).subscribe({
          next: (data) => {
            this.projectData$.next(data.projectData);
            this.applicantData$.next(data.applicantData);
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

  openConfirmationDialog(
    app: string,
    projectID: string,
    decision: string,
    sentence: string
  ): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: sentence,
      },
    });

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
