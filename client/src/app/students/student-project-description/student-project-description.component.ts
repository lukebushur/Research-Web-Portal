import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StudentProjectInfo } from '../models/student-project-info';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-student-project-description',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './student-project-description.component.html',
  styleUrl: './student-project-description.component.css'
})
export class StudentProjectDescriptionComponent {
  readonly showProfessor = input<boolean>(true);
  readonly professorEmail = input<string>();
  readonly project = input.required<StudentProjectInfo>();
}
