import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface AppliedStudentList {
  name: string;
  gpa: number;
  degree: string;
  email: string;
  experience: boolean;
}

const STUDENT_DATA: AppliedStudentList[] = [
  {name: 'Sean Tierney', gpa: 12.0, degree: 'Computer Science BS', email: 'sean@test.com', experience: true},
  {name: 'Luke Bushur', gpa: 0.9, degree: 'Computer Science BS', email: 'luke@test.com', experience: true},
  {name: 'Prasanna Suresh', gpa: 0.6, degree: 'Computer Science BS', email: 'prasanna@test.com', experience: true},
  {name: 'Adam Hughes', gpa: 0.3, degree: 'Computer Science BS', email: 'adam@test.com', experience: false},
  {name: 'Nick Scoble', gpa: -0.2, degree: 'Computer Science BS', email: 'nick@test.com', experience: false},
];

@Component({
  selector: 'app-applied-student-table',
  templateUrl: './applied-student-table.component.html',
  styleUrls: ['./applied-student-table.component.css'],
})
export class AppliedStudentTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'gpa', 'degree', 'email', 'experience'];
  dataSource = new MatTableDataSource(STUDENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
