import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndustryDashboardService } from 'src/app/controllers/industry-dashboard-controller/industry-dashboard.service';
import { JobCardData } from './job-card/job-card-data';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { JobCardComponent } from './job-card/job-card.component';
import { NgFor } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-industry-dashboard',
  templateUrl: './industry-dashboard.component.html',
  styleUrls: ['./industry-dashboard.component.css'],
  standalone: true,
  imports: [MatTabsModule, NgFor, JobCardComponent]
})
export class IndustryDashboardComponent {
  timeInterval: Subscription;

  activeJobs: JobCardData[];
  draftedJobs: JobCardData[];
  archivedJobs: JobCardData[];

  constructor(private router: Router, private industryDashboardService: IndustryDashboardService) { }

  ngOnInit(): void {
    this.timeInterval = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.industryDashboardService.getJobs())
    ).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.activeJobs = data.success.jobs.active;
          this.draftedJobs = data.success.jobs.draft;
          this.archivedJobs = data.success.jobs.archived;
        }
      },
      error: (data: any) => {
        console.log('Get jobs failed.', data.error);
      }
    });
  }

  ngOnDestroy(): void {
    this.timeInterval.unsubscribe();
  }
}
