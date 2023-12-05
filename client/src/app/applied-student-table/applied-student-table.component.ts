import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataSharingService } from '../_helpers/table-data-sharing/table-data-sharing.service'

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
  constructor(private _liveAnnouncer: LiveAnnouncer, private tableData: TableDataSharingService) { 
  }

  ngOnInit() {
    this.tableData.getData().subscribe((value) => {
      this.testStudentData = value;
      this.dataSource = new MatTableDataSource(this.testStudentData);
    });
  }
  
  displayedColumns: string[] = ['name', 'gpa', 'degree', 'email', 'experience', 'buttons'];

  testStudentData: any[] = [];
  dataSource = new MatTableDataSource(this.testStudentData);

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
