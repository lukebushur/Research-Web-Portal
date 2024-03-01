import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentChooserComponent } from './assessment-chooser.component';

describe('AssessmentChooserComponent', () => {
  let component: AssessmentChooserComponent;
  let fixture: ComponentFixture<AssessmentChooserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentChooserComponent]
    });
    fixture = TestBed.createComponent(AssessmentChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
