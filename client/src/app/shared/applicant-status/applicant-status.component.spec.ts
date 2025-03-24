import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantStatusComponent } from './applicant-status.component';

describe('ApplicantStatusComponent', () => {
  let component: ApplicantStatusComponent;
  let fixture: ComponentFixture<ApplicantStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
