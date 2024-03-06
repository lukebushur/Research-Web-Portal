import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAssessmentComponent } from './add-edit-assessment.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({ standalone: true, selector: 'app-create-questions-form', template: '' })
class CreateQuestionsFormStubComponent {
  @Input() questionsGroup: FormGroup;
  @Input() questionsData?: QuestionData[];
}

describe('AddEditAssessmentComponent', () => {
  let component: AddEditAssessmentComponent;
  let fixture: ComponentFixture<AddEditAssessmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditAssessmentComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        CreateQuestionsFormStubComponent,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(AddEditAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
