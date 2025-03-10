import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

import { SignupComponent } from './signup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SignupService } from 'app/controllers/signup-controller/signup.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from 'app/controllers/auth-controller/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Tokens, saveTokens, restoreTokens } from 'app/helpers/testing/token-storage';

describe('SignupComponent', () => {
  let tokens: Tokens;

  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let loader: HarnessLoader;

  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;
  let signupService: jasmine.SpyObj<SignupService>;

  // mock data for the signup response
  const testSignupResponse = {
    success: {
      accessToken: 'garbage',
      refreshToken: 'refreshToken',
      user: {
        accountType: 0,
      }
    }
  };
  // mock data for the getMajors response
  const testGetMajorResponse = {
    success: {
      majors: [
        'Computer Science',
        'Music',
        'Biology',
      ]
    }
  };

  beforeAll(() => {
    tokens = saveTokens();
  });

  beforeEach(() => {
    // Create a spy to 'replace' the call to Router's navigateByUrl function.
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(Promise.resolve(false));

    // Create a spy to 'replace' the call to AuthService's getMajors function.
    // This spy returns an observable with the value of testGetMajorResponse.
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getMajors']);
    authService.getMajors.and.returnValue(of(testGetMajorResponse));

    // Create a spy to 'replace' the call to SignupService's signup function.
    // This spy returns an observable with the value of testSignupResponse.
    signupService = jasmine.createSpyObj<SignupService>('SignupService', ['signup']);
    signupService.signup.and.returnValue(of(testSignupResponse));

    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatProgressBarModule,
        BrowserAnimationsModule,
        SignupComponent
      ],
      providers: [
        { provide: SignupService, useValue: signupService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });
    fixture = TestBed.createComponent(SignupComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
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
    expect(component.nameErrorMessage()).toBe('Minimum length: 2');
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
    expect(component.passwordErrorMessage()).toBe('Minimum length: 10');
  });

  it('should pass universityLocation validators', () => {
    const testUniversity = 'Purdue University Fort Wayne';
    component.signupForm.get('universityLocation')?.setValue(testUniversity);
    expect(component.requiredFieldErrorMessage('universityLocation', 'University')).toBe('');
  });

  it('should not pass universityLocation validators', () => {
    component.signupForm.get('universityLocation')?.setValue('');
    expect(component.requiredFieldErrorMessage('universityLocation', 'University')).toBe('University is a required field');
  });

  it('should pass GPA validators', () => {
    const gpa = '3.0';
    component.signupForm.get('GPA')?.setValue(gpa);
    expect(component.gpaErrorMessage()).toBe('');
  });

  it('should not pass GPA validators', () => {
    const gpa = 'good';
    component.signupForm.get('GPA')?.setValue(gpa);
    expect(component.gpaErrorMessage()).toBe('GPA is invalid');
  });

  it('should display a disabled submit button', async () => {
    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBe(true);
  });

  it('should display an active submit button for faculty registration', async () => {
    const testName = 'First Last';
    const testEmail = 'testemail@email.com';
    const testPassword = '10characters';

    // set valid text field values in the DOM
    const nameInput = await loader.getHarness(MatInputHarness.with({ selector: '#name' }));
    await nameInput.setValue(testName);
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
    await emailInput.setValue(testEmail);
    const passwordInput = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
    await passwordInput.setValue(testPassword);

    // set valid selector values in the DOM
    const universitySelector = await loader.getHarness(MatSelectHarness.with({ selector: '#universityLocation' }));
    await universitySelector.open();
    (await universitySelector.getOptions({ text: 'Purdue University Fort Wayne' }))[0].click();
    await universitySelector.close();
    const accountTypeSelector = await loader.getHarness(MatSelectHarness.with({ selector: '#accountType' }));
    await accountTypeSelector.open();
    (await accountTypeSelector.getOptions({ text: 'Faculty' }))[0].click();
    await accountTypeSelector.close();

    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBeFalse();
  });

  it('should display an active submit button for student registration', async () => {
    const testName = 'First Last';
    const testEmail = 'testemail@email.com';
    const testPassword = '10characters';
    const testGpa = '3.0';

    // set valid text field values in the DOM
    const nameInput = await loader.getHarness(MatInputHarness.with({ selector: '#name' }));
    await nameInput.setValue(testName);
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
    await emailInput.setValue(testEmail);
    const passwordInput = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
    await passwordInput.setValue(testPassword);

    // set valid selector values in the DOM
    const universitySelector = await loader.getHarness(MatSelectHarness.with({ selector: '#universityLocation' }));
    await universitySelector.open();
    await (await universitySelector.getOptions({ text: 'Purdue University Fort Wayne' }))[0].click();
    await universitySelector.close();
    const accountTypeSelector = await loader.getHarness(MatSelectHarness.with({ selector: '#accountType' }));
    await accountTypeSelector.open();
    await (await accountTypeSelector.getOptions({ text: 'Student' }))[0].click();
    await accountTypeSelector.close();

    // after setting accountType to 0, more fields appear, and the list of possible
    // majors is set utilizing the AuthService
    expect(authService.getMajors).withContext('getMajors called').toHaveBeenCalled();

    // set valid student-specific values in the DOM
    const gpaInput = await loader.getHarness(MatInputHarness.with({ selector: '#gpa' }));
    await gpaInput.setValue(testGpa);
    const majorsSelector = await loader.getHarness(MatSelectHarness.with({ selector: '#Major' }));
    await majorsSelector.open();
    (await majorsSelector.getOptions({ text: 'Computer Science' }))[0].click();
    (await majorsSelector.getOptions({ text: 'Biology' }))[0].click();
    await majorsSelector.close();

    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBeFalse();
  });

  it('should route to the home component', () => {
    component.signupForm.get('accountType')?.setValue(0);
    component.onSubmit();

    expect(signupService.signup.calls.any()).withContext('signup called').toBeTrue();
    expect(router.navigateByUrl).withContext('navigate called').toHaveBeenCalledOnceWith('/notify-confirm-email');
  });

  afterAll(() => {
    restoreTokens(tokens);
  });
});
