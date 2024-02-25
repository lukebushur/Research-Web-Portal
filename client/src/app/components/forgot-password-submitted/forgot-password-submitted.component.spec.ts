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

  it('should display correct HTML elements', () => {
    const forgotSubmittedElement: HTMLElement = fixture.nativeElement;
    const title = forgotSubmittedElement.querySelector('h1')!;
    expect(title.textContent).toEqual('Reset Password Request Submitted');
    const firstParagraph = forgotSubmittedElement.querySelector('p')!;
    expect(firstParagraph.textContent).toEqual('A confirmation email has been sent to the provided address.');
    const anchor: HTMLAnchorElement = forgotSubmittedElement.querySelector('a')!;
    expect(anchor.textContent).toEqual('login page');
    expect(anchor.getAttribute('routerLink')).toEqual('/login');
  });
});
