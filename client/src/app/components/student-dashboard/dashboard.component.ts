import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';

@Component({
  selector: 'student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class StudentDashboard {
  constructor(private router: Router, private studentDashboardService: StudentDashboardService) {}

  ngOnInit() {
    this.getAllOpportunities();
    this.getStudentInfo();
  }
  applications: any[] = [];
  opportunities: any[] = [];
  majorOpportunities: { [major: string]: any[] } = {};
  majors: string[] = [];
  studentGPA: number = 0;
  studentMajors: string[] = [];

  //function for the see all applications button
  //this will let you view all the things you have applied to
  getStudentApplications() {
    this.studentDashboardService.getStudentApplications().subscribe({
      next: (data) => {
        this.applications = data.success.applications;
        console.log(this.applications);
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
    this.router.navigate(['/apply-to-post'], { queryParams: {
      profName: opportunity.professorName,
      profEmail: opportunity.professorEmail,
      oppId: opportunity.projectID,
    }});
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
}
