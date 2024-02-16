import { Component, Input } from '@angular/core';
import { JobCardData } from './job-card-data';
import { IndustryDashboardService } from 'src/app/controllers/industry-dashboard-controller/industry-dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() jobData: JobCardData;

  constructor(private industryDashboardService: IndustryDashboardService, private snackBar: MatSnackBar) { }

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

  deleteJob() {
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