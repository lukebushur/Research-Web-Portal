import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { AuthService } from 'src/app/controllers/auth-controller/auth.service';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

//Interface for an entries to the applied student table
export interface DetailedAppliedStudentList {
  questions: any[];
  name: string;
  email: string;
  GPA: number;
  majors: string;
  status: string;
  application: Date;
}

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})

export class ViewProjectComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'email', 'GPA', 'majors', 'status']; //This array determines the displayedd columns in the table
  projectID: string = ""; //projectID, grabbed from the url parameters and used in requests
  projectType: string = ""; //projectType, grabbed from the url parameter and used in requests
  projectName: string = ""; //Project Name
  projectData: any = -1; // The object that will store the data of the project from the getProject route, set in the constructor
  studentData: DetailedAppliedStudentList[] = []; //This array contains the student data for the table
  filteredData: DetailedAppliedStudentList[] = [];
  dataSource = new MatTableDataSource(this.filteredData); //This object is used for the material table data source to allow for the table to work/sort etc
  posted: String; // The string that holds the date the project was posted on
  deadline: String; // the string that is the deadline of the project

  // Applicant data filter variables
  tableFilter: string = '';
  minGPA: number = 2;
  maxGPA: number = 4;

  // Student related information
  // We need to store the professors email
  isStudent: boolean = true;
  professorEmail: string = "";

  accountType: number;

  constructor(
    private route: ActivatedRoute,
    private navRouter: Router,
    private facultyService: FacultyProjectService,
    private studentService: StudentDashboardService,
    private dateConverter: DateConverterService,
    private _liveAnnouncer: LiveAnnouncer,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      let projectFetchInformation;
      this.projectID = params['projectID'];

      // We're going to assume project-type means they're coming from
      // Faculty dashboard
      const accountInfo = this.authService.getAccountInfo();
      const authResponse = await firstValueFrom(accountInfo);
      this.accountType = authResponse?.success?.accountData?.userType;

      this.isStudent = this.accountType == environment.studentType
      
      if (!this.isStudent) {
        this.projectType = params['projectType'];
        projectFetchInformation = this.facultyService.getProject(this.projectID, this.projectType)
      } else {
        // Now we're going to assume this is just the student dashboard viewing a project
        this.projectType = "active";
        // Convert from Base64 so it looks prettier in the URL
        this.professorEmail = atob(params['projectEmail'] || "");
        projectFetchInformation = this.studentService.getProjectInfo(this.professorEmail, this.projectID)
      }
       //grab projectID from url parameter
      //Get project data from database, this only grabs the project name currently, but if more information is need it will exist in the data variable below
      projectFetchInformation.subscribe({
        next: (data) => {
          this.projectName = data.success.project.projectName; //Grabs project name from request
          this.projectData = data.success.project; //stores project data from request into project data variable
          this.posted = this.dateConverter.convertShortDate(this.projectData.posted); //get the string for the posted variable
          this.deadline = this.dateConverter.convertShortDate(this.projectData.deadline); //get the string for the deadlien variable
        },
        error: (error) => {
          console.error('Error fetching projects', error);
        },
      });
      //Get application data from database
      if (!this.isStudent) {
        // Student doesn't have authorization from server to view this data
        // So we're going to skip it if they are a student!
        this.facultyService.detailedFetchApplicants(this.projectID).subscribe({
          next: (data) => {
            let dataWrapper = data.success.applicants.map((applicant: any )=> {
              let majorsStr = applicant.majors[0];
              for (let i = 1; i < applicant.majors.length; i++) {
                majorsStr += ', ' + applicant.majors[i];
              }
              return {
                ...applicant,
                majors: majorsStr,
              };
            }); //data wrapper to hold a subset of the request's response information
            dataWrapper.forEach((x: { project: string; }) => {
              x.project = this.projectID; //add a field to each element of the data
            });
            this.studentData = dataWrapper; //sets the student's data to each the warpper
            
            // this.dataSource = new MatTableDataSource(this.studentData); //set up the datasource for the mat table
            this.updateTable();
            this.dataSource.sort = this.sort; //set up the sorting for the table
          },
          error: (error) => {
            console.error('Error fetching projects', error);
          }
        })
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
  }

  formatGPA(): string {
    return (Math.round(this.projectData.GPA * 100) / 100).toFixed(2);
  }

  back() {
    // Send the user back!
    this.location.back();
  }

  apply() {
    this.navRouter.navigate(['/student/apply-to-project'], {
      queryParams: {
        profName: this.projectData.projectName,
        profEmail: this.professorEmail,
        oppId: this.projectID,
      }
    });
  }

  displayRequirementType(reqType: string): string {
    if (reqType === 'text') {
      return 'Text Response';
    } else if (reqType === 'radio button') {
      return 'Single Select';
    } else if (reqType === 'check box') {
      return 'Multiple Select';
    }
    return 'Invalid Question Type';
  }

  // Necessary method for sorting the table with the material UI tables
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  //This method makes a request to the server updating the decision then fetches the applicants
  applicationDecision(app: any, decision: string) {
    this.facultyService.applicationDecide(app, this.projectID, decision).subscribe({
      next: (data) => {
        this.fetchApplicants();
      },
    });
  }

  updateTable() {
    this.filteredData = this.studentData.filter((student) => {
      // Compare GPA to min/max
      const passesGPACheck = this.minGPA <= student.GPA && student.GPA <= this.maxGPA;

      // Only pass this student if it passes the GPA check
      return passesGPACheck;
    })
    // Set the new data (update table)
    this.dataSource = new MatTableDataSource(this.filteredData);
    this.dataSource.filter = this.tableFilter.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  //This method fetches the applicants and then updates the shared applicants data, if it is able to get the projectID from the 
  //table data sharing service, then it grabs the applicants and sets the datasource to the object returned
  fetchApplicants() {
    this.facultyService.detailedFetchApplicants(this.projectID).subscribe({
      next: (data) => {
        let dataWrapper = data.success.applicants;
        dataWrapper.forEach((x: { project: string; }) => {
          x.project = this.projectID;
        });
        this.studentData = dataWrapper;
        // this.dataSource = new MatTableDataSource(this.studentData);
        this.updateTable();
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      }
    })
  }
} 
