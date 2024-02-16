import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyFormQuestionComponent } from './apply-form-question.component';

describe('ApplyFormQuestionComponent', () => {
  let component: ApplyFormQuestionComponent;
  let fixture: ComponentFixture<ApplyFormQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyFormQuestionComponent]
    });
    fixture = TestBed.createComponent(ApplyFormQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
