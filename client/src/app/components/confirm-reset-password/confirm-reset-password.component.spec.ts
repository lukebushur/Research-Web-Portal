import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmResetPasswordComponent } from './confirm-reset-password.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { LoginService } from 'src/app/controllers/login-controller/login.service';

describe('ConfirmResetPasswordComponent', () => {
  let component: ConfirmResetPasswordComponent;
  let fixture: ComponentFixture<ConfirmResetPasswordComponent>;
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
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [
        // Use Jasmine spy objects instead of the actual services/classes
        { provide: LoginService, useValue: loginService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute},
      ],
    });
    fixture = TestBed.createComponent(ConfirmResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with route parameters and redirect', () => {
    // ngOnInit will have already been called by now, which incorporates the whole
    // functionality of the component
    expect(component).toBeTruthy();
    expect(confirmResetPasswordSpy).withContext('confirmResetPassword called').toHaveBeenCalledOnceWith({
      email: routeParams.email,
      passwordResetToken: routeParams.id,
    });
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/login']);
  });
});
