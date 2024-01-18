import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-opportunity',
  standalone: true,
  imports: [],
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent {
  @Input() text="";
}
