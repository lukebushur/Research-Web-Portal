import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { LoginService } from 'src/app/controllers/login-controller/login.service';
import { Router, provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const testLoginResponse = {
    success: {
      accessToken: 'garbage',
      accountType: 0,
    }
  };
  let loginSpy: jasmine.Spy;
  let router: Router;

  beforeEach(() => {
    // Create a spy to 'replace' the call to loginService's login function.
    // This spy returns an observable with the value of testLoginResponse.
    const loginService = jasmine.createSpyObj('LoginService', ['login']);
    loginSpy = loginService.login.and.returnValue(of(testLoginResponse));

    TestBed.configureTestingModule({
      imports: [
        SpinnerSubComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        LoginComponent,
      ],
      // Use the spies defined in this test instead of the actual services
      providers: [
        provideRouter([]),
        { provide: LoginService, useValue: loginService },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass email validators', () => {
    const testEmail = 'testemail@email.com';
    component.loginForm.get('email')?.setValue(testEmail);
    expect(component.emailErrorMessage()).toBe('');
  });

  it('should not pass email validators', () => {
    const testEmail = 'invalidemail';
    component.loginForm.get('email')?.setValue(testEmail);
    expect(component.emailErrorMessage()).toBe('Not a valid email');
  });

  it('should pass password validators', () => {
    const testPassword = '10characters';
    component.loginForm.get('password')?.setValue(testPassword);
    expect(component.passwordErrorMessage()).toBe('');
  });

  it('should not pass password validators', () => {
    const testPassword = 'tooshort';
    component.loginForm.get('password')?.setValue(testPassword);
    expect(component.passwordErrorMessage()).toBe('Minimum password length: 10');
  });

  it('should display a forgot password link', () => {
    const loginElement: HTMLElement = fixture.nativeElement;
    const forgotLink: HTMLAnchorElement = loginElement.querySelector('a')!;
    expect(forgotLink.getAttribute('routerLink')).toBe('/forgot-password');
  });

  it('should display a disabled submit button', () => {
    const loginElement: HTMLElement = fixture.nativeElement;
    const submitButton = loginElement.querySelector('button')!;
    expect(submitButton.disabled).toBe(true);
  });

  it('should display an active submit button', () => {
    const testEmail = 'testemail@email.com';
    const testPassword = '10characters';
    component.loginForm.get('email')?.setValue(testEmail);
    component.loginForm.get('password')?.setValue(testPassword);
    fixture.detectChanges();

    const loginElement: HTMLElement = fixture.nativeElement;
    const submitButton = loginElement.querySelector('button')!;
    expect(submitButton.disabled).toBeFalse();
  });

  it('should route to the student dashboard component', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onSubmit();
    expect(loginSpy.calls.any()).withContext('login called').toBeTrue();
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/dashboard']);
  });
});
