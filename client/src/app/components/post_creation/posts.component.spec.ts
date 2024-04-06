import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PostProjectComponent } from './posts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { QuestionData } from 'src/app/_models/projects/questionData';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

@Component({ standalone: true, selector: 'app-create-questions-form', template: '' })
class CreateQuestionsFormStubComponent {
  @Input() questionsGroup: FormGroup;
  @Input() questionsData?: QuestionData[];
}

describe('PostProjectComponent', () => {
  let component: PostProjectComponent;
  let fixture: ComponentFixture<PostProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SpinnerSubComponent,
        CreateQuestionsFormStubComponent,
        HttpClientTestingModule,
        MatDialogModule,
        MatRadioModule,
        MatSnackBarModule,
        MatStepperModule,
        MatFormFieldModule,
        MatSelectModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        PostProjectComponent,
      ],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(PostProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Set all form values via HTML to random data and check and see if they were properly submitted
  it('should check for data', () => {
    // Should set the HTML values to random data
    const title = 'test title';
    const description = 'test description';
    const category = 'test category';
    const startDate = new Date();
    const endDate = new Date();
    const questions = [{ question: 'test question', type: 'text', required: true}];

    // Now we want to set the form values to the random data
    component.projectForm.setValue({
      details: {
        projectName: title,
        description: description,
        majors: null,
        categories: [],
        deadline: endDate,
        responsibilities: null,
        GPA: null
      },
      questionsGroup: {
        questions: questions
      }
    });
  })

});