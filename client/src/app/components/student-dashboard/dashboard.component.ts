import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class StudentDashboard {
  constructor(private router: Router, private studentDashboardService: StudentDashboardService, private dateService: DateConverterService) { }

  ngOnInit() {
    this.getAllOpportunities();
    this.getStudentInfo();
    this.getStudentApplications();
  }

  @ViewChild(MatSort) sort: MatSort;

  applications: any[] = [];
  applicationData: any[] = [];
  opportunities: any[] = [];
  majorOpportunities: { [major: string]: any[] } = {};
  majors: string[] = [];
  studentGPA: number = 0;
  studentMajors: string[] = [];

  displayedColumns: string[] = ['project title', 'project sponsor', 'gpa req', 'applied date', 'deadline', 'status']; //This array determines the displayedd columns in the table
  dataSource = new MatTableDataSource(this.applicationData);

  //function for the see all applications button
  //this will let you view all the things you have applied to
  getStudentApplications() {
    this.studentDashboardService.getStudentApplications().subscribe({
      next: (data) => {
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
      },
      error: (error) => {
        console.error('Error fetching applications', error);
      },
    });
  }

  getAllOpportunities() {
    this.studentDashboardService.getOpportunities().subscribe({
      next: (data) => {
        const opportunities = data.success.data;

        // Group opportunities by major
        opportunities.forEach((opportunity: { majors: string[]; }) => {
          opportunity.majors.forEach((major: string) => {
            if (!this.majorOpportunities[major]) {
              this.majorOpportunities[major] = [];
              this.majors.push(major);
            }
            this.majorOpportunities[major].push(opportunity);
          });
        });

        console.log(this.majorOpportunities);
        console.log(this.majors);
      },
      error: (error) => {
        console.error('Error getting opportunities', error);
      }
    });
  }

  applyToOpportunity(opportunity: any): void {
    this.router.navigate(['/apply-to-post'], {
      queryParams: {
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity.projectID,
      }
    });
  }

  searchOpportunities() {
    this.router.navigate(['/student-opportunities']);
  }

  getStudentInfo(): void {
    this.studentDashboardService.getStudentInfo().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.studentGPA = data.success.accountData.GPA;
          this.studentMajors = data.success.accountData.Major;
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }

  meetRequirements(opportunity: any): boolean {
    return ((!opportunity.GPA) || (this.studentGPA >= opportunity.GPA))
      && ((opportunity.majors.length === 0) || (opportunity.majors.some((major: string) => this.studentMajors.includes(major))));
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
        case 'project title':
          return this.compare(a.projectName, b.projectName, isAsc); // Use projectName instead of name
        case 'project sponsor':
          return this.compare(a.projectSponsor, b.projectSponsor, isAsc); // Use projectSponsor instead of GPA
        case 'deadline':
          return this.compareDate(a.deadline, b.deadline, isAsc);
        case 'applied date':
          return this.compareDate(a.appliedDate, b.appliedDate, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
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

}
