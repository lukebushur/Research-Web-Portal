import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { WebSocketService } from 'src/app/controllers/web-socket-controller/web-socket.service';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-student-applications-overview',
  templateUrl: './student-applications-overview.component.html',
  styleUrls: ['./student-applications-overview.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    SpinnerComponent
  ]
})
export class StudentApplicationsOverviewComponent {
  constructor(private router: Router, private studentDashboardService: StudentDashboardService, private dateService: DateConverterService,private webSocketService: WebSocketService) { }
  private applicationSubscription: Subscription;

  ngOnInit() {
    //this.getStudentApplications();
    //this.webSocketService.connect();
    this.applicationSubscription = this.webSocketService.applicationSubject.subscribe((data) => {
      this.handleNewApplication(data);
    })
  }

  ngOnDestroy() {
    if(this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applications: any[] = [];
  applicationData: any[] = [];
  opportunities: any[] = [];
  majorOpportunities: { [major: string]: any[] } = {};
  majors: string[] = [];

  displayedColumns: string[] = ['project-title', 'project-sponsor', 'gpa-req', 'applied', 'deadline', 'status', 'actions']; //This array determines the displayedd columns in the table
  dataSource = new MatTableDataSource(this.applicationData);

  //function for the see all applications button
  //this will let you view all the things you have applied to
  getStudentApplications() {
    this.studentDashboardService.getStudentApplications().subscribe({
      next: (data) => {
        this.applications = [];
        this.applicationData = [];
        this.dataSource = new MatTableDataSource(this.applicationData);

        this.applications = data.success.applications;
        this.applications.forEach((element) => {
          let obj = {
            status: element.status,
            appliedDate: this.dateService.convertShortDate(element.appliedDate),
            deadline: this.dateService.convertShortDate(element.deadline),
            projectName: element.projectName,
            GPAREQ: element.GPAREQ,
            projectSponsor: element.projectSponsor,
            id: element.applicationID,
          };
          this.applicationData.push(obj);
        });

        this.dataSource = new MatTableDataSource(this.applicationData); //set up the datasource for the mat table
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error fetching applications', error);
      },
    });
  }

  applyToOpportunity(opportunity: any): void {
    this.router.navigate(['/student/apply-to-project'], {
      queryParams: {
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity.projectID,
      }
    });
  }

  //This method is used to sort the table whenever the table's sort functionality is clicked.
  sortData(sort: Sort) {
    const data = this.applicationData.slice(); //grabs the data from the student data array
    if (!sort.active || sort.direction === '') {
      this.applicationData = data;
      return;
    }

    this.applicationData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc'; //Checks if the sorting is done ascending if true, otherwise false. This will be used in the compare method
      console.log(sort.active);
      switch (sort.active) {
        case this.displayedColumns[0]:
          return this.compare(a.projectName, b.projectName, isAsc); // Use projectName instead of name
        case this.displayedColumns[1]:
          return this.compare(a.projectSponsor, b.projectSponsor, isAsc); // Use projectSponsor instead of GPA
        case this.displayedColumns[4]:
          return this.compareDate(a.deadline, b.deadline, isAsc);
        case this.displayedColumns[3]:
          return this.compareDate(a.appliedDate, b.appliedDate, isAsc);
        case this.displayedColumns[5]:
          return this.compare(a.status, b.status, isAsc);
        case this.displayedColumns[2]:
          return this.compare(a.GPAREQ, b.GPAREQ, isAsc);
        default:
          return 0;
      }
    });
  }
  //This method is used as the logic behind the sorting of the table. It takes a date, number, or string for a and b, then isAsc as a boolean.
  //It will return -1 if a is less than b and the table is ascending and also returns -1 if a is greater than b and the table is not ascending (descending).
  //otherwise it returns 1. This is used in the above sort method to sort the table
  compare(a: number | String | Date, b: number | String | Date, isAsc: boolean) {
    console.log(a);
    console.log((a < b ? -1 : 1));
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareDate(a: string, b: string, isAsc: boolean) {
    let dateA = new Date(a);
    let dateB = new Date(b);
    return (dateA < dateB ? -1 : 1) * (isAsc ? 1 : -1);
  }

  rescindApplication(applicationID: string) {
    this.studentDashboardService.deleteApplication(applicationID).subscribe({
      next: (data: any) => {
        this.getStudentApplications();
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }

  modifyApplication(applicationID: string) {
    // this.router.navigate(['/student/apply-to-project'], {
    //   queryParams: {
    //     applicationID: applicationID,
    //   }
    // });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleNewApplication(data: any) {
    const newApplication = data;
    this.applications.push(newApplication);
  }
}
