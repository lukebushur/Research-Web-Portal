import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataSharingService } from '../_helpers/table-data-sharing/table-data-sharing.service'
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service';

export interface AppliedStudentList {
  name: string;
  gpa: number;
  degree: string;
  email: string;
  experience: boolean;
  status: string;
}

@Component({
  selector: 'app-applied-student-table',
  templateUrl: './applied-student-table.component.html',
  styleUrls: ['./applied-student-table.component.css'],
})
export class AppliedStudentTableComponent implements AfterViewInit {
  constructor(private _liveAnnouncer: LiveAnnouncer, private tableData: TableDataSharingService,
    private facultyProjectService: FacultyProjectService,) {
  }

  ngOnInit() {
    this.tableData.AppliedStudentList.subscribe((value) => {
      this.testStudentData = value;
      this.dataSource = new MatTableDataSource(this.testStudentData);
      this.dataSource.sort = this.sort;
      console.log("subscribed");
    });
    this.repeat = setInterval(() => {
      this.fetchApplicants();
    }, 5000);
  }

  displayedColumns: string[] = ['name', 'gpa', 'degree', 'email', /*'experience',*/ 'buttons'];
  repeat: any;
  testStudentData: any[] = [];
  dataSource = new MatTableDataSource(this.testStudentData);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
  }

  fetchApplicants() {
    console.log(this.tableData.projectID);
    if (this.tableData.projectID) {
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

  applicationDecide(app: any, decision: string) {
    let decision2 = (decision === 'Accept') ? 'Accept' : 'Reject';
    let data = {
      "projectID": this.tableData.projectID,
      "applicationID": app,
      "decision": decision2
    }
    console.log(app + " " + this.tableData.projectID);
    this.facultyProjectService.applicationDecision(data).subscribe({
      next: (data) => {
        this.fetchApplicants();
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
