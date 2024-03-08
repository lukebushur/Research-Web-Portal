import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TableDataSharingService } from '../../_helpers/table-data-sharing/table-data-sharing.service';
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service';

//Interface for an entries to the applied student table
export interface AppliedStudentList {
  name: string;
  gpa: number;
  degree: string;
  email: string;
  project: string;
  application: string;
  status: string;
}

@Component({
  selector: 'app-applied-student-table',
  templateUrl: './applied-student-table.component.html',
  styleUrls: ['./applied-student-table.component.css'],
})

//This component is for the table of applied students for a faculty project, this constructor just sets up the necessary services
export class AppliedStudentTableComponent {
  displayedColumns: string[] = ['name', 'gpa', 'degree', 'email', 'buttons']; //This array determines the displayedd columns in the table
  testStudentData: any[] = []; //This array contains the student data for the table
  dataSource = new MatTableDataSource(this.testStudentData); //This object is used for the material table data source to allow for the table to work/sort etc
  
  
  constructor(private _liveAnnouncer: LiveAnnouncer, private tableData: TableDataSharingService,
    private facultyProjectService: FacultyProjectService,) {
  }

  //This init method grabs the values for the appliedStudentList, then sets up the data for the material UI table
  ngOnInit() {
    this.tableData.AppliedStudentList.subscribe((value) => {
      this.testStudentData = value;
      this.dataSource = new MatTableDataSource(this.testStudentData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //This method fetches the applicants and then updates the shared applicants data, if it is able to get the projectID from the 
  //table data sharing service, then it grabs the applicants and sets the datasource to the object returned
  fetchApplicants() {
    if (this.tableData.getProjectID()) {
      this.facultyProjectService.demoFetchApplicants(this.tableData.projectID).subscribe({
        next: (data) => {
          this.dataSource = data.success.applicants;
        },
        error: (error) => {
          console.error('Error fetching projects', error);
        },
      });
    }
  }

  //This method makes a request to the server updating the decision then fetches the applicants
  applicationDecision(app: any, decision: string) {
    this.facultyProjectService.applicationDecide(app, this.tableData.projectID, decision).subscribe({
      next: (data) => {
        this.fetchApplicants();
      },
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
}
