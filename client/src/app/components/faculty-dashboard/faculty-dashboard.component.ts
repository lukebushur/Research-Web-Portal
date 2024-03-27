import { Component } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AppliedStudentTableComponent } from '../applied-student-table/applied-student-table.component';
import { ResearchProjectCardComponent } from '../research-project-card/research-project-card.component';

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css'],
  standalone: true,
  imports: [
    ResearchProjectCardComponent,
    AppliedStudentTableComponent,
    SpinnerComponent,
  ]
})

export class FacultyDashboardComponent {
  constructor() { }
}