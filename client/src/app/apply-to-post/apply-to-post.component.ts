import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TextFieldComponent } from './text-field/text-field.component';
import { ImageComponent } from './image/image.component';
import { OpportunityComponent } from './opportunity/opportunity.component';

@Component({
  selector: 'app-to-post',
  templateUrl: './apply-to-post.component.html',
  imports: [TextFieldComponent, ImageComponent, OpportunityComponent],
  styleUrls: ['./apply-to-post.component.css'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})
export class ApplyToOpp {
  title = 'applyToOpp';

  constructor() {}
  
  submitApp(id: any) {
    console.log("submitted");
  }
}
