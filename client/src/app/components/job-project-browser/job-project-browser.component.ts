import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, interval, startWith, switchMap } from 'rxjs';
import { JobProject } from 'src/app/_models/industry/job-projects/jobProject';
import { JobProjectService } from 'src/app/controllers/job-project-controller/job-project.service';
import { JobProjectCardComponent } from './job-project-card/job-project-card.component';

@Component({
  selector: 'app-job-project-browser',
  standalone: true,
  imports: [AsyncPipe, JobProjectCardComponent],
  templateUrl: './job-project-browser.component.html',
  styleUrl: './job-project-browser.component.css'
})
export class JobProjectBrowserComponent implements OnInit {
  jobProjects$ = new BehaviorSubject<JobProject[]>([]);
  timeInterval: Subscription;

  constructor(private jobProjectService: JobProjectService) { }

  ngOnInit(): void {
    this.timeInterval = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.jobProjectService.getJobProjects()),
    ).subscribe({
      next: (data: JobProject[]) => {
        console.log(data);
        this.jobProjects$.next(data);
      },
      error: (data: any) => {
        console.error('Get job projects failed', data);
      }
    });
  }

  ngOnDestroy(): void {
    this.timeInterval.unsubscribe();
  }
}
