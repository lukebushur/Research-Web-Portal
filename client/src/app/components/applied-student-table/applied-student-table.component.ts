import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectFetchData } from 'src/app/_models/projects/projectFetchData';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// Interface for applied students table entries
interface AppliedStudent {
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
    MatPaginatorModule,
  ],
})

// this component is for the table of applied students for a faculty project
export class AppliedStudentTableComponent implements AfterViewInit, OnChanges {
  // project selected on the faculty dashboard
  @Input() project: ProjectFetchData | null;
  // determines the displayedd columns in the table
  displayedColumns: string[] = ['name', 'gpa', 'majors', 'email', 'status'];
  // list of currently applied students
  appliedStudents: AppliedStudent[];
  // DataSource used for the material table to enable easy filtering, sorting, and pagination
  dataSource: MatTableDataSource<AppliedStudent>

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // event emitted whenever an application decision is made within the table
  @Output() applicationUpdateEvent = new EventEmitter<number>();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private facultyProjectService: FacultyProjectService,
    public dialog: MatDialog
  ) {
    // initialize table data
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
    // set paginator and sort
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // whenever the selected project changes, this method is called
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'].previousValue === changes['project'].currentValue) {
      return;
    }

    // whenever the selected project changes, update the table data
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

  // called whenever the user types in the filter text field
  // filters the table, removing rows that do not match with the filter text
  // field value
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // announce the change in sort state for assistive technology
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // make a request to the server, updating the decision and emitting an
  // application update event
  applicationDecision(app: string, decision: string) {
    this.facultyProjectService.applicationDecide(app, this.project!.id, decision).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.applicationUpdateEvent.emit(this.project!.number);
        }
      },
    });
  }

  openConfirmationDialog(app: string, decision: string, sentence: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: sentence } });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User clicked "Yes", perform your action here
        this.applicationDecision(app, decision);
      } else {
        // User clicked "No" or closed the dialog
      }
    });
  }
}
