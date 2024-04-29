import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { JobProject } from 'src/app/_models/industry/job-projects/jobProject';
import { JobProjectService } from 'src/app/controllers/job-project-controller/job-project.service';

@Component({
  selector: 'app-job-project-card',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './job-project-card.component.html',
  styleUrl: './job-project-card.component.css'
})
export class JobProjectCardComponent {
  @Input() jobProjectData: JobProject;

  constructor(
    private router: Router,
    private jobProjectService: JobProjectService,
    private snackbar: MatSnackBar,
  ) { }

  editJobProject(): void {
    this.router.navigate([`/industry/edit-job-project/${this.jobProjectData._id}`]);
  }

  deleteJobProject(): void {
    this.jobProjectService.deleteJobProject(this.jobProjectData._id).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.snackbar.open('Job project successfully deleted!', 'Dismiss', {
            duration: 5000,
          });
        }
      },
      error: (data: any) => {
        console.error('Delete job failed!');
        this.snackbar.open('Error deleting job project', 'Dismiss', {
          duration: 5000,
        });
      },
    });
  }
}
