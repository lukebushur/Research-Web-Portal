import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TableDataSharingService } from '../../_helpers/table-data-sharing/table-data-sharing.service';
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectFetchData } from 'src/app/_models/projects/projectFetchData';

// Interface for applied students table entries
export interface AppliedStudent {
  name: string;
  gpa: number;
  majors: string;
  email: string;
  status: string;
  project: string;
  application: string;
}

@Component({
  selector: 'app-applied-student-table',
  templateUrl: './applied-student-table.component.html',
  styleUrls: ['./applied-student-table.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule
  ],
})

//This component is for the table of applied students for a faculty project, this constructor just sets up the necessary services
export class AppliedStudentTableComponent implements AfterViewInit, OnChanges {
  @Input() project: ProjectFetchData | null;
  displayedColumns: string[] = ['name', 'gpa', 'majors', 'email', 'status']; //This array determines the displayedd columns in the table
  appliedStudents: AppliedStudent[];
  dataSource: MatTableDataSource<AppliedStudent> //This object is used for the material table data source to allow for the table to work/sort etc

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // TODO: Add this
  // @Output() applicationUpdateEvent = new EventEmitter<number>();

  constructor(private _liveAnnouncer: LiveAnnouncer, private tableData: TableDataSharingService,
    private facultyProjectService: FacultyProjectService,) {
      if (!this.project) {
        this.appliedStudents = [];
      } else {
        this.appliedStudents = this.project.applications.map((application) => {
          return {
            name: application.name,
            gpa: application.GPA,
            majors: application.major.join(', '),
            email: application.email,
            status: application.status,
            project: this.project!.id,
            application: application.application
          };
        });
      }
      this.dataSource = new MatTableDataSource(this.appliedStudents);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'].previousValue === changes['project'].currentValue) {
      return;
    }

    if (!this.project) {
      this.appliedStudents = [];
    } else {
      this.appliedStudents = this.project.applications.map((application) => {
        return {
          name: application.name,
          gpa: application.GPA,
          majors: application.major.join(', '),
          email: application.email,
          status: application.status,
          project: this.project!.id,
          application: application.application
        };
      });
    }
    this.dataSource.data = this.appliedStudents;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Announce the change in sort state for assistive technology
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  //This method makes a request to the server updating the decision then fetches the applicants
  applicationDecision(app: any, decision: string) {
    this.facultyProjectService.applicationDecide(app, this.tableData.projectID, decision).subscribe({
      next: (data) => {
        //TODO: emit event for faculty dashbaord to refresh data
      },
    });
  }
}
