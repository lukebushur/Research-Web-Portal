import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSubmittedComponent } from './forgot-password-submitted.component';

describe('ForgotPasswordSubmittedComponent', () => {
  let component: ForgotPasswordSubmittedComponent;
  let fixture: ComponentFixture<ForgotPasswordSubmittedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordSubmittedComponent]
    });
    fixture = TestBed.createComponent(ForgotPasswordSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
