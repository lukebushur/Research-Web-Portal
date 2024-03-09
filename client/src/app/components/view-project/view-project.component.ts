import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

//Interface for an entries to the applied student table
export interface detailedAppliedStudentList {
  questions: any[];
  name: string;
  GPA: number;
  email: string;
  application: Date;
  status: string;
  majors: string[];
}

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})

export class ViewProjectComponent {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'gpa', 'majors', 'email', 'status']; //This array determines the displayedd columns in the table
  projectID: string = ""; //projectID, grabbed from the url parameters and used in requests
  projectType: string = ""; //projectType, grabbed from the url parameter and used in requests
  projectName: string = ""; //Project Name
  projectData: any = -1; // The object that will store the data of the project from the getProject route, set in the constructor
  studentData: detailedAppliedStudentList[] = []; //This array contains the student data for the table
  filteredData: detailedAppliedStudentList[] = [];
  dataSource = new MatTableDataSource(this.filteredData); //This object is used for the material table data source to allow for the table to work/sort etc
  posted: String; // The string that holds the date the project was posted on
  deadline: String; // the string that is the deadline of the project

  // Min/max GPA for filtering
  minGPA: number = 2;
  maxGPA: number = 4;

  // Search filters
  @Input() SearchMajor = "";
  @Input() SearchName = "";
  @Input() SearchEmail = "";

  constructor(private facultyService: FacultyProjectService, private route: ActivatedRoute,
    private dateConverter: DateConverterService, private _liveAnnouncer: LiveAnnouncer,) {
    this.route.params.subscribe(params => {
      this.projectType = params['projectType'];
      this.projectID = params['projectID']; //grab projectID from url parameter
      //Get project data from database, this only grabs the project name currently, but if more information is need it will exist in the data variable below
      this.facultyService.getProject(this.projectID, this.projectType).subscribe({
        next: (data) => {
          this.projectName = data.success.project.projectName; //Grabs project name from request
          this.projectData = data.success.project; //stores project data from request into project data variable
          this.posted = this.dateConverter.convertDate(this.projectData.posted); //get the string for the posted variable
          this.deadline = this.dateConverter.convertDate(this.projectData.deadline); //get the string for the deadlien variable
        },
        error: (error) => {
          console.error('Error fetching projects', error);
        },
      });
      //Get application data from database
      this.facultyService.detailedFetchApplicants(this.projectID).subscribe({
        next: (data) => {
          let dataWrapper = data.success.applicants; //data wrapper to hold a subset of the request's response information
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
    });
  }

  //Necessary method for sorting the table with the material UI tables
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  //This method is used to sort the table whenever the table's sort functionality is clicked.
  sortData(sort: Sort) {
    const data = this.studentData.slice(); //grabs the data from the student data array
    if (!sort.active || sort.direction === '') {
      this.studentData = data;
      return;
    }

    this.studentData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc'; //Checks if the sorting is done ascending if true, otherwise false. This will be used in the compare method
      switch (sort.active) {
        case 'Name':
          return this.compare(a.name, b.name, isAsc);
        case 'GPA':
          return this.compare(a.GPA, b.GPA, isAsc);
        case 'Majors':
          return this.compareArr(a.majors, b.majors, isAsc);
        case 'Email':
          return this.compare(a.email, b.email, isAsc);
        case 'Status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
    this.updateTable();
  }
  //This method is used as the logic behind the sorting of the table. It takes a date, number, or string for a and b, then isAsc as a boolean.
  //It will return -1 if a is less than b and the table is ascending and also returns -1 if a is greater than b and the table is not ascending (descending).
  //otherwise it returns 1. This is used in the above sort method to sort the table
  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  //This method does the same as the method above, but instead checks the first element of an array and only for string. Modify this as need or add more
  //compare methods if new or different types are added to the table.
  compareArr(a: string[], b: string[], isAsc: boolean) {
    return (a[0] < b[0] ? -1 : 1) * (isAsc ? 1 : -1);
  }

  //This method makes a request to the server updating the decision then fetches the applicants
  applicationDecision(app: any, decision: string) {
    this.facultyService.applicationDecide(app, this.projectID, decision).subscribe({
      next: (data) => {
        this.fetchApplicants();
      },
    });
  }

  compareString(baseString: string, compareToString: string) {
    // If string is empty, return true because we want to ignore the string
    if (compareToString.length == 0) return true;

    // Compare string if it's similar
    if (baseString.toLowerCase().indexOf(compareToString.toLowerCase()) !== -1) {
      return true;
    }

    return false
  }

  updateTable() {
    this.filteredData = this.studentData.filter((student) => {
      // Compare student name to search filter
      let PassesNameSearch = this.compareString(student.name, this.SearchName);
      // Compare GPA to min/max
      let PassesGPACheck = this.minGPA <= student.GPA && student.GPA <= this.maxGPA;
      // Like student name, compare email
      let PassesEmailCheck = this.compareString(student.email, this.SearchEmail);;

      // To skip major search if doesnt exist
      let PassesMajorSearch = true;
      if (student.majors) {
        // If majors exist, reset it back
        PassesMajorSearch = false;
        student.majors.forEach((major: (string)) => {
          if (this.compareString(major, this.SearchMajor)) {
            PassesMajorSearch = true;
          }
        })
      }

      // Only pass this student if they passes all checks
      return PassesMajorSearch && PassesNameSearch && PassesGPACheck && PassesEmailCheck
    })
    // Set the new data (update table)
    this.dataSource = new MatTableDataSource(this.filteredData);
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
