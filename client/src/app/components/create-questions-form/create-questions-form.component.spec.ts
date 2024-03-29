import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionsFormComponent } from './create-questions-form.component';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateQuestionsFormComponent', () => {
  let component: CreateQuestionsFormComponent;
  let fixture: ComponentFixture<CreateQuestionsFormComponent>;
  const questionsGroup = new FormGroup({
    questions: new FormArray([]),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateQuestionsFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(CreateQuestionsFormComponent);
    component = fixture.componentInstance;
    component.questionsGroup = questionsGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
