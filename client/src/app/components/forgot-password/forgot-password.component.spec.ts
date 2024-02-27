import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HarnessLoader } from '@angular/cdk/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginService } from 'src/app/controllers/login-controller/login.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let loader: HarnessLoader;
  let forgotPasswordSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    // Spy object for LoginService. Captures the provided function calls and returns
    // predictable mock data instead.
    const loginService = jasmine.createSpyObj('LoginService', ['forgotPassword']);
    forgotPasswordSpy = loginService.forgotPassword.and.returnValue(of({ success: { status: 200 } }));

    // Spy object for Router. Captures the provided function calls and returns
    // predictable mock data instead.
    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate;

    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        // Use Jasmine spy objects instead of the actual services/classes
        { provide: LoginService, useValue: loginService },
        { provide: Router, useValue: router },
      ],
    });
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    // For easier Angular material components testing
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a disabled submit button', async () => {
    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBeTrue();
  });

  it('should display an enabled submit button', async () => {
    const testEmail = 'testemail@email.com';
    const testPassword = 'goodPassword';

    // set email and password fields to valid values
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
    await emailInput.setValue(testEmail);
    const passwordInput = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
    await passwordInput.setValue(testPassword);

    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBeFalse();
  });

  it('onSubmit() should function correctly', () => {
    const data = {
      email: 'testemail@email.com',
      provisionalPassword: 'betterPassword',
    };

    // set form to valid values
    component.forgotForm.get('email')?.setValue(data.email);
    component.forgotForm.get('password')?.setValue(data.provisionalPassword);
    component.onSubmit();
    fixture.detectChanges();

    expect(forgotPasswordSpy).withContext('forgotPassword called').toHaveBeenCalledOnceWith(data);
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/forgot-password-submitted']);
  });
});
