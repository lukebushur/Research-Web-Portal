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
    this.router.navigate(['/student/apply-to-project'], {
      queryParams: {
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity.projectID,
      }
    });
  }

  searchOpportunities() {
    this.router.navigate(['/student/search-projects']);
  }

  getStudentApplications() {
    this.router.navigate(['/student/applications-overview']);
  }

  viewProject(project: any) {
    this.router.navigate([`/viewProject/${btoa(project.professorEmail)}/${project.projectID}`]);
  }

  getStudentInfo(): void {
    this.studentDashboardService.getStudentInfo().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.studentGPA = data.success.accountData.GPA;
          this.studentMajors = data.success.accountData.Major || [];
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }

  meetRequirements(opportunity: any): boolean {
    return ((!opportunity.GPA) || (this.studentGPA >= opportunity.GPA))
      && ((opportunity.majors.length === 0) || 
        // Sometimes the Majors object comes back empty, so for testing reasons we should skip
        // This step if there are no majors currently
        (this.studentMajors.length > 0 && opportunity.majors.some((major: string) => this.studentMajors.includes(major))));
  }

  dateToString(dateString: string | undefined): string {
    if (!dateString) {
      return 'None';
    }
    const date = new Date(dateString);
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', { weekday: undefined, year: 'numeric', month: 'short', day: 'numeric' });
    return dateTimeFormat.format(date);
  }
}
