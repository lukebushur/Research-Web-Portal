import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TextFieldComponent } from './text-field/text-field.component';
import { ImageComponent } from './image/image.component';
import { OpportunityComponent } from './opportunity/opportunity.component';

@Component({
  selector: 'app-to-post',
  templateUrl: './apply-to-post.component.html',
  imports: [TextFieldComponent, ImageComponent, OpportunityComponent, CommonModule],
  styleUrls: ['./apply-to-post.component.css'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})
export class ApplyToOpp implements OnInit {
  title = 'applyToOpp';

  questions: Array<string> = [
    "hello"
  ]

  @ViewChildren('app-text-field', {read: ViewContainerRef})
  answers!: ViewContainerRef;

  ngOnInit() {

  }

  constructor() {
    // Get the questions for this application
    // Set the questions

    // createComponent
    // 

  }
  
  submitApp(id: any) {
    console.log(this.answers);
  }
}
