import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantStatusComponent } from './applicant-status.component';

describe('ApplicantStatusComponent', () => {
  let component: ApplicantStatusComponent;
  let fixture: ComponentFixture<ApplicantStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantStatusComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create with input "Accept"', () => {
    fixture.componentRef.setInput('status', 'Accept')
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with input "Reject"', () => {
    fixture.componentRef.setInput('status', 'Reject')
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with input "Pending"', () => {
    fixture.componentRef.setInput('status', 'Pending')
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
