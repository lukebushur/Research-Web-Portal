import { Component, Input } from '@angular/core';
import { JobCardData } from '../models/job-card-data';
import { IndustryDashboardService } from 'app/controllers/industry-dashboard-controller/industry-dashboard.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css'],
  imports: [
    MatCardModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
    MatSnackBarModule,
  ]
})
export class JobCardComponent {
  @Input() jobData: JobCardData;

  constructor(
    private router: Router,
    private industryDashboardService: IndustryDashboardService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  get jobTypeString(): string {
    let str = (this.jobData.isFullTime) ? 'Full-Time' : 'Part-Time';
    str += (this.jobData.isInternship) ? ' Internship' : ' Job';
    return str;
  }

  dateToString(dateString: string | undefined): string {
    if (!dateString) {
      return 'None';
    }
    const date = new Date(dateString);
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', { weekday: undefined, year: 'numeric', month: 'short', day: 'numeric' });
    return dateTimeFormat.format(date);
  }

  tagsString(): string {
    if (!this.jobData.tags || this.jobData.tags.length < 1) {
      return 'None';
    }

    let tagsString = this.jobData.tags[0];
    for (let i = 1; i < this.jobData.tags.length; i++) {
      tagsString += ', ' + this.jobData.tags[i];
    }

    return tagsString;
  }

  editJob(): void {
    this.router.navigate([`/industry/edit-job/${this.jobData._id}`]);
  }

  deleteJob(): void {
    this.industryDashboardService.deleteJob(this.jobData._id).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.snackBar.open('Job successfully deleted!', 'Close', {
            duration: 5000,
          });
        }
      },
      error: (data: any) => {
        console.log('Delete job failed!');
      },
    });
  }
}
