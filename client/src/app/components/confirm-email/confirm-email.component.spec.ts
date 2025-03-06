import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailService } from 'app/controllers/email-controller/email.service';
import { ConfirmEmailComponent } from './confirm-email.component';
import { AuthService } from 'app/controllers/auth-controller/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>

  beforeEach(() => {
    emailServiceSpy = jasmine.createSpyObj('EmailService', ['confirmEmail']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAccountInfo']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    emailServiceSpy.confirmEmail.and.returnValue(of({}));
    authServiceSpy.getAccountInfo.and.returnValue(of({
      success: {
        accountData: { userType: 0 }
      }
    }));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [ConfirmEmailComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: new Map([['emailToken', 'testToken']])
            }
          }
        },
        { provide: Router, useValue: routerSpy },
        { provide: EmailService, useValue: emailServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackbarSpy },
      ],
    });
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm the email and navigate to the appropriate dashboard on success', () => {
    component.ngOnInit();

    expect(emailServiceSpy.confirmEmail).toHaveBeenCalledWith('testToken');
    expect(authServiceSpy.getAccountInfo).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/student/dashboard']);
  });

  it('should handle confirmation failure and redirect to login', () => {
    emailServiceSpy.confirmEmail.and.returnValue(throwError(() => new Error('Confirmation failed')));

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
