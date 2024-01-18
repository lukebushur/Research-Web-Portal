import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gpa',
  standalone: true,
  imports: [],
  templateUrl: './gpa.component.html',
  styleUrls: ['./gpa.component.css']
})
export class GpaComponent {
  @Input() gpa="";
}
