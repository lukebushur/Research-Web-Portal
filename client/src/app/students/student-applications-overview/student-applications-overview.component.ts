import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../student-service/student.service';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApplicantStatusComponent } from "../../shared/applicant-status/applicant-status.component";
import { OverviewApplication } from '../models/applications-overview';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-student-applications-overview',
  templateUrl: './student-applications-overview.component.html',
  styleUrls: ['./student-applications-overview.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    ApplicantStatusComponent,
  ]
})
export class StudentApplicationsOverviewComponent implements AfterViewInit {
  // Contains the data to be displayed in the table
  dataSource = new MatTableDataSource<OverviewApplication>([]);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // This array determines the displayed columns in the table.
  displayedColumns: string[] = [
    'projectName',
    'projectSponsor',
    'GPAREQ',
    'appliedDate',
    'deadline',
    'status',
    'actions'
  ];

  constructor(
    private router: Router,
    private studentService: StudentService,
    private _liveAnnouncer: LiveAnnouncer,
  ) { }

  // After the table is loaded in the DOM, then the table sort and paginator
  // will be set. Thus, the table values and functionality can be initialized.
  ngAfterViewInit(): void {
    this.getStudentApplications();
  }

  // Update the student's applications, sort, and paginator after getting data
  // from the server
  getStudentApplications(): void {
    this.studentService.getStudentApplications().subscribe({
      next: (applications: OverviewApplication[]) => {
        this.dataSource.data = applications;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error fetching applications', error);
      },
    });
  }

  // Apply the filter to the table, only showing rows that contain the text in
  // the input
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Necessary method for sorting the table with the material UI tables;
  // announces sorting changes to screen readers
  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Redirect to ApplyToPost page for updating application
  // Not implemented yet - does nothing right now
  modifyApplication(applicationID: string): void {
    // this.router.navigate(['/student/apply-to-project'], {
    //   queryParams: {
    //     applicationID: applicationID,
    //   }
    // });
  }

  // Rescind the application and refresh the student's applications afterwards
  rescindApplication(applicationID: string): void {
    this.studentService.deleteApplication(applicationID).subscribe({
      next: (data: any) => {
        this.getStudentApplications();
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }
}
