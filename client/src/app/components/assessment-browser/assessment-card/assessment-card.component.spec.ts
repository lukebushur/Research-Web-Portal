import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentCardComponent } from './assessment-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AssessmentData } from 'src/app/_models/assessments/assessmentData';

describe('AssessmentCardComponent', () => {
  let component: AssessmentCardComponent;
  let fixture: ComponentFixture<AssessmentCardComponent>;
  const assessmentTestData: AssessmentData = {
    _id: '123',
    name: 'Test Assessment Name',
    dateCreated: new Date(),
    questions: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatCardModule,
        MatDividerModule,
        AssessmentCardComponent,
      ],
    });
    fixture = TestBed.createComponent(AssessmentCardComponent);
    component = fixture.componentInstance;
    component.assessmentData = assessmentTestData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
