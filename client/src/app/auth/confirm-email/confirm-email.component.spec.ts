import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth-service/auth.service';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let loader: HarnessLoader;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['confirmEmail']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    authServiceSpy.confirmEmail.and.returnValue(of({}));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [ConfirmEmailComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: new Map([
                ['userId', 'testId'],
                ['emailToken', 'testToken'],
              ])
            }
          }
        },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm the email and navigate to login', async () => {
    component.ngOnInit();

    expect(authServiceSpy.confirmEmail).toHaveBeenCalledWith('testId', 'testToken');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should handle confirmation failure and redirect to login', async () => {
    authServiceSpy.confirmEmail.and.returnValue(throwError(() => new Error('Confirmation failed')));

    component.ngOnInit();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
