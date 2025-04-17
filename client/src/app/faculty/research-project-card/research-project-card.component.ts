import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { FacultyService } from '../faculty-service/faculty.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjectFetchData } from 'app/faculty/models/projectFetchData';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-research-project-card',
  templateUrl: './research-project-card.component.html',
  styleUrls: ['./research-project-card.component.css'],
  imports: [
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatTooltipModule,
    DatePipe,
  ]
})
export class ResearchProjectCardComponent {
  // project data from the faculty dashboard
  @Input() project: ProjectFetchData;
  // whether the project is currently selected
  @Input() selected: boolean;

  // emits an event whenever this project is deleted or archived
  @Output() projectUpdateEvent = new EventEmitter<number>();

  constructor(
    private router: Router,
    private facultyService: FacultyService,
  ) { }

  // if the user presses the update button, navigate to the update project page
  buttonUpdateProject(): void {
    this.router.navigate([`/faculty/update-project/${this.project.projectType}/${this.project.id}`]);
  }

  // if the user presses the delete button, send a delete project request to the
  // server and emit a project update event
  buttonDeleteProject(): void {
    const upperProjectType = this.project.projectType.charAt(0).toUpperCase() + this.project.projectType.slice(1);
    this.facultyService.deleteProject(this.project.id, upperProjectType).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.projectUpdateEvent.emit(this.project.number);
        }
      },
      error: (error) => {
        console.error('Error deleting project:', error);
      }
    });
  }

  // if the user presses the archive button, send an archive project request to
  // the server and emit a project update event
  buttonArchiveProject(): void {
    this.facultyService.archiveProject(this.project.id).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.projectUpdateEvent.emit(this.project.number);
        }
      },
      error: (error) => {
        console.error('Error archiving project:', error);
      }
    });
  }

  buttonUnArchiveProject(): void {
    this.facultyService.unarchiveProject(this.project.id).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.projectUpdateEvent.emit(this.project.number);
        }
        console.log('Archive response:', data);
      },
      error: (error) => {
        console.error('Error archiving project:', error);
      }
    });
  }
}
