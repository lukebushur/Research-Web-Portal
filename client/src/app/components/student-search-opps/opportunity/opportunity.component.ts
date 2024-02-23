import { Component, Input } from '@angular/core';

@Component({
  selector: 'opportunity',
  standalone: true,
  imports: [],
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent {
  @Input() name="";
  answer: string = "";
}