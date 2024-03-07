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
  }
 
  majorOpportunities: { [major: string]: any[] } = {};
  majors: string[] = [];
  studentGPA: number = 0;
  studentMajors: string[] = [];

<<<<<<< HEAD
=======
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

>>>>>>> 0855b930e18c555df40a8359f424e466044684a8
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

  getStudentApplications() {
    this.router.navigate(['/studentApplicationOverview']);
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
}
