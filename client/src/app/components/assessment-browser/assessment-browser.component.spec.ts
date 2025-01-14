import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentBrowserComponent } from './assessment-browser.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AssessmentBrowserComponent', () => {
  let component: AssessmentBrowserComponent;
  let fixture: ComponentFixture<AssessmentBrowserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AssessmentBrowserComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(AssessmentBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
