import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProjectBrowserComponent } from './job-project-browser.component';

describe('JobProjectBrowserComponent', () => {
  let component: JobProjectBrowserComponent;
  let fixture: ComponentFixture<JobProjectBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProjectBrowserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobProjectBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
