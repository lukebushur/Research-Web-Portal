import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-standing',
  standalone: true,
  imports: [],
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.css']
})
export class StandingComponent {
  @Input() standing="";
}
