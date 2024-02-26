import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAssessmentComponent } from './add-edit-assessment.component';

describe('AddEditAssessmentComponent', () => {
  let component: AddEditAssessmentComponent;
  let fixture: ComponentFixture<AddEditAssessmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditAssessmentComponent]
    });
    fixture = TestBed.createComponent(AddEditAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
