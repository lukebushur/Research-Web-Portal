import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SignupComponent } from './signup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SignupService } from 'src/app/controllers/signup-controller/signup.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let testSignupResponse: Object;
  let signupSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    // mock data for the signup response
    testSignupResponse = {
      success: {
        accessToken: 'garbage',
        refreshToken: 'refreshToken',
        user: {
          accountType: 0,
        }
      }
    };

    // Create a spy to 'replace' the call to SignupService's signup function.
    // This spy returns an observable with the value of testSignupResponse.
    const signupService = jasmine.createSpyObj('SignupService', ['signup']);
    signupSpy = signupService.signup.and.returnValue(of(testSignupResponse));

    // Create a spy to 'replace' the call to Router's navigate function.
    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate;

    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      // Use the spies defined in this test instead of the actual services
      providers: [
        { provide: SignupService, useValue: signupService },
        { provide: Router, useValue: router },
      ],
    });
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass name validators', () => {
    const testName = 'First Last';
    component.signupForm.get('name')?.setValue(testName);
    expect(component.nameErrorMessage()).toBe('');
  });

  it('should not pass name validators', () => {
    const testName = 'f';
    component.signupForm.get('name')?.setValue(testName);
    expect(component.nameErrorMessage()).toBe('Minimum name length: 2');
  });

  it('should pass email validators', () => {
    const testEmail = 'testemail@email.com';
    component.signupForm.get('email')?.setValue(testEmail);
    expect(component.emailErrorMessage()).toBe('');
  });

  it('should not pass email validators', () => {
    const testEmail = 'invalidemail';
    component.signupForm.get('email')?.setValue(testEmail);
    expect(component.emailErrorMessage()).toBe('Not a valid email');
  });

  it('should pass password validators', () => {
    const testPassword = '10characters';
    component.signupForm.get('password')?.setValue(testPassword);
    expect(component.passwordErrorMessage()).toBe('');
  });

  it('should not pass password validators', () => {
    const testPassword = 'tooshort';
    component.signupForm.get('password')?.setValue(testPassword);
    expect(component.passwordErrorMessage()).toBe('Minimum password length: 10');
  });

  it('should display a disabled submit button', () => {
    const signupElement: HTMLElement = fixture.nativeElement;
    const submitButton = signupElement.querySelector('button')!;
    expect(submitButton.disabled).toBe(true);
  });

  it('should display an active submit button', () => {
    const testName = 'First Last';
    const testEmail = 'testemail@email.com';
    const testPassword = '10characters';
    component.signupForm.get('name')?.setValue(testName);
    component.signupForm.get('email')?.setValue(testEmail);
    component.signupForm.get('password')?.setValue(testPassword);
    fixture.detectChanges();
    
    const signupElement: HTMLElement = fixture.nativeElement;
    const submitButton = signupElement.querySelector('button')!;
    expect(submitButton.disabled).toBe(false);
  });

  it('should route to the home component', () => {
    component.onSubmit();
    expect(signupSpy.calls.any()).withContext('signup called').toBe(true);
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/home']);
  });
});
