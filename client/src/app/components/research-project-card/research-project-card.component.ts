import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service';
import { Router } from '@angular/router';
import { DateConverterService } from 'app/controllers/date-converter-controller/date-converter.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjectFetchData } from 'app/_models/projects/projectFetchData';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-research-project-card',
  templateUrl: './research-project-card.component.html',
  styleUrls: ['./research-project-card.component.css'],
  imports: [
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatTooltipModule
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
    private facultyProjectService: FacultyProjectService,
    public dateConverter: DateConverterService,
  ) { }

  // if the user presses the update button, navigate to the update project page
  buttonUpdateProject(): void {
    this.router.navigate([`/faculty/update-project/${this.project.projectType}/${this.project.id}`]);
  }

  // if the user presses the delete button, send a delete project request to the
  // server and emit a project update event
  buttonDeleteProject(): void {
    const upperProjectType = this.project.projectType.charAt(0).toUpperCase() + this.project.projectType.slice(1);
    this.facultyProjectService.deleteProject(this.project.id, upperProjectType).subscribe({
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
    this.facultyProjectService.archiveProject(this.project.id).subscribe({
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
    this.facultyProjectService.unarchiveProject(this.project.id).subscribe({
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
