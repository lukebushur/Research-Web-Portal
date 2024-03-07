import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddEditJobComponent } from './add-edit-job.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { Component, Input } from '@angular/core';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';

@Component({ standalone: true, selector: 'app-create-questions-form', template: '' })
class CreateQuestionsFormStubComponent {
  @Input() questionsGroup: FormGroup;
  @Input() questionsData?: QuestionData[];
}

describe('AddEditJobComponent', () => {
  let component: AddEditJobComponent;
  let fixture: ComponentFixture<AddEditJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditJobComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatRadioModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatStepperModule,
        CreateQuestionsFormStubComponent,
      ],
    });
    fixture = TestBed.createComponent(AddEditJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
