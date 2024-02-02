import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterOutlet } from '@angular/router';
import { TextFieldComponent } from './text-field/text-field.component';
import { ImageComponent } from './image/image.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-to-post',
  templateUrl: './apply-to-post.component.html',
  imports: [TextFieldComponent, ImageComponent, OpportunityComponent, CommonModule, MatSidenavModule, FormsModule, MatIconModule],
  styleUrls: ['./apply-to-post.component.css'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})
export class ApplyToPostComponent implements OnInit {
  title = 'applyToOpp';

  //For side-nav opening
  opened = false;

  questions: Array<string> = [
    "hello"
  ]

  @ViewChildren('app-text-field', {read: ViewContainerRef})
  answer!: ViewContainerRef;

  ngOnInit() {

  }

  constructor() {
    // Get the questions for this application
    // Set the questions

    // createComponent
    // 

  }


  
  submitApp(id: any) {
    console.log(this.answer);
  }
}
