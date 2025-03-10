import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndustryService } from '../industry-service/industry.service';
import { JobCardData } from '../models/job-card-data';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { JobCardComponent } from '../job-card/job-card.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-industry-dashboard',
  templateUrl: './industry-dashboard.component.html',
  styleUrls: ['./industry-dashboard.component.css'],
  imports: [MatTabsModule, JobCardComponent]
})
export class IndustryDashboardComponent {
  timeInterval: Subscription;

  activeJobs: JobCardData[];
  draftedJobs: JobCardData[];
  archivedJobs: JobCardData[];

  constructor(
    private router: Router,
    private industryService: IndustryService,
  ) { }

  ngOnInit(): void {
    this.timeInterval = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.industryService.getJobs())
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
