import { Component, Input } from '@angular/core';
import { JobCardData } from '../job-card-data';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() jobData: JobCardData;

  constructor() {}

  ngOnInit(): void {
  } 
}
