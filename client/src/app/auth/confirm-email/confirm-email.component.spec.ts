import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailService } from 'app/controllers/email-controller/email.service';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let loader: HarnessLoader;

  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    emailServiceSpy = jasmine.createSpyObj<EmailService>('EmailService', ['confirmEmail']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    emailServiceSpy.confirmEmail.and.returnValue(of({}));
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
        { provide: EmailService, useValue: emailServiceSpy },
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

    expect(emailServiceSpy.confirmEmail).toHaveBeenCalledWith('testId', 'testToken');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should handle confirmation failure and redirect to login', async () => {
    emailServiceSpy.confirmEmail.and.returnValue(throwError(() => new Error('Confirmation failed')));

    component.ngOnInit();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
