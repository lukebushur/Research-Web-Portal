import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from './text-field/text-field.component';
import { ImageComponent } from './image/image.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApplyToPostService } from 'src/app/controllers/apply-to-post/apply-to-post.service';

@Component({
  selector: 'app-to-post',
  templateUrl: './apply-to-post.component.html',
  imports: [TextFieldComponent, ImageComponent, OpportunityComponent, CommonModule, MatSidenavModule, FormsModule, MatIconModule],
  styleUrls: ['./apply-to-post.component.css'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})
export class ApplyToPostComponent implements OnInit {
  // title = 'applyToOpp';

  //For side-nav opening
  opened = false;

  // questions: Array<string> = [
  //   "hello"
  // ]
  project: any;
  questions: any[];

  @ViewChildren('app-text-field', { read: ViewContainerRef })
  answer!: ViewContainerRef;

  constructor(private applyService: ApplyToPostService) { }

  ngOnInit() {
    this.applyService.getProjects().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.project = response.success.data[0];
          this.questions = this.project.questions;
          console.log(this.project);
        }
      },
      error: (response: any) => {
        console.log('Error getting projects.');
      },
    });
  }

  submitApp(id: any) {
    console.log(this.answer);
  }
}
