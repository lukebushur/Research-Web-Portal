import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndustryDashboardService } from 'src/app/controllers/industry-dashboard-controller/industry-dashboard.service';
import { JobCardData } from './job-card/job-card-data';

@Component({
  selector: 'app-industry-dashboard',
  templateUrl: './industry-dashboard.component.html',
  styleUrls: ['./industry-dashboard.component.css']
})
export class IndustryDashboardComponent {
  activeJobs: JobCardData[];
  draftedJobs: JobCardData[];
  archivedJobs: JobCardData[];

  constructor(private router: Router, private industryDashboardService: IndustryDashboardService) { }

  ngOnInit(): void {
    this.industryDashboardService.getJobs().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.activeJobs = data.success.result.active;
          this.draftedJobs = data.success.result.draft;
          this.archivedJobs = data.success.result.archived;
        }
      },
      error: (data: any) => {
        console.log('Get jobs failed.', data.error);
      }
    });
  }
}
