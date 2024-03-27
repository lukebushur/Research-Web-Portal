import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentBrowserComponent } from './assessment-browser.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssessmentBrowserComponent', () => {
  let component: AssessmentBrowserComponent;
  let fixture: ComponentFixture<AssessmentBrowserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AssessmentBrowserComponent],
    });
    fixture = TestBed.createComponent(AssessmentBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
