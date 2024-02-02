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

  applications: any[] = [];

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
}
