import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
import { AuthService } from '../auth-service/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let loader: HarnessLoader;

  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Spy object for AuthService. Captures the provided function calls and returns
    // predictable mock data instead.
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['forgotPassword']);
    authService.forgotPassword.and.returnValue(of({ success: { status: 200 } }));

    // Spy object for Router. Captures the provided function calls and returns
    // predictable mock data instead.
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        ForgotPasswordComponent
      ],
      providers: [
        // Use Jasmine spy objects instead of the actual services/classes
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
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

    // set email and password fields to valid values
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
    await emailInput.setValue(testEmail);

    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBeFalse();
  });

  it('onSubmit() should function correctly', async () => {
    const testEmail = 'testemail@email.com';

    // set form to valid values
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
    await emailInput.setValue(testEmail);
    component.onSubmit();
    fixture.detectChanges();

    expect(authService.forgotPassword)
      .withContext('forgotPassword called')
      .toHaveBeenCalledOnceWith(testEmail);
    expect(router.navigateByUrl)
      .withContext('navigate called')
      .toHaveBeenCalledOnceWith('/forgot-password-submitted');
  });
});
