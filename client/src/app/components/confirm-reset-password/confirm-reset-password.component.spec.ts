import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmResetPasswordComponent } from './confirm-reset-password.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { LoginService } from 'src/app/controllers/login-controller/login.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('ConfirmResetPasswordComponent', () => {
  let component: ConfirmResetPasswordComponent;
  let fixture: ComponentFixture<ConfirmResetPasswordComponent>;
  let loader: HarnessLoader;

  const routeParams = {
    email: 'testemail@email.com',
    id: '123',
  };
  // Mocks the properties for ActivatedRoute
  const activatedRoute = {
    snapshot: {
      paramMap: convertToParamMap(routeParams)
    }
  };
  let confirmResetPasswordSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    // Spy object for LoginService. Captures the provided function calls and returns
    // predictable mock data instead.
    const loginService = jasmine.createSpyObj('LoginService', ['confirmResetPassword']);
    confirmResetPasswordSpy = loginService.confirmResetPassword.and.returnValue(of({ success: { status: 200 } }));

    // Spy object for Router. Captures the provided function calls and returns
    // predictable mock data instead.
    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      declarations: [ConfirmResetPasswordComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatSnackBarModule,
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
        { provide: ActivatedRoute, useValue: activatedRoute},
      ],
    });
    fixture = TestBed.createComponent(ConfirmResetPasswordComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with route parameters', () => {
    expect(component).toBeTruthy();
  });

  it('should display a disabled submit button', async () => {
    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBeTrue();
  });

  it('should display an enabled submit button', async () => {
    const testPassword = 'goodPassword';

    // set email and password fields to valid values
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '#provisionalPassword' }));
    await emailInput.setValue(testPassword);

    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    expect(await submitButton.isDisabled()).toBeFalse();
  });

  it('onSubmit() should function correctly', async () => {
    const data = {
      email: routeParams.email,
      passwordResetToken: routeParams.id,
      provisionalPassword: 'goodPassword',
    };

    // set form to valid values
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '#provisionalPassword' }));
    await emailInput.setValue(data.provisionalPassword);
    component.onSubmit();
    fixture.detectChanges();

    expect(confirmResetPasswordSpy).withContext('confirmResetPassword called').toHaveBeenCalledOnceWith(data);
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/login']);
  });
});
