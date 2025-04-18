import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { QuestionData } from 'app/shared/models/questionData';

interface ProjectInformation {
  projectName: string;
  professorName?: string;
  posted: Date;
  deadline: Date;
  description: string;
  responsibilities?: string;
  categories: string[];
  GPA: number;
  majors: string[];
  questions: QuestionData[];
}

@Component({
  selector: 'app-project-info-card',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './project-info-card.component.html',
  styleUrl: './project-info-card.component.css'
})
export class ProjectInfoCardComponent {
  readonly showProfessor = input<boolean>(true);
  readonly professorEmail = input<string>();
  readonly project = input.required<ProjectInformation>();
}
