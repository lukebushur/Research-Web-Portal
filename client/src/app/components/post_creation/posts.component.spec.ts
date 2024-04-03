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
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';
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

});