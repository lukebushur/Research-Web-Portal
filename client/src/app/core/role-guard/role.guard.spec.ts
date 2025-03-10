import { TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, GuardResult, provideRouter, Router, RouterStateSnapshot } from '@angular/router';

import { roleGuard } from './role.guard';
import { environment } from 'environments/environment';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AuthService } from 'app/auth/auth-service/auth.service';

const getStudentInfoResponse = {
  success: {
    status: 200,
    message: "ACCOUNT_FOUND",
    accountData: {
      email: "test@email.com",
      name: "Test Test",
      universityLocation: "Purdue University Fort Wayne",
      emailConfirmed: true,
      userType: environment.studentType,
      GPA: 3.0,
      Major: [
        "Major 1",
        "Major 2"
      ]
    }
  }
}

describe('roleGuard', () => {
  let router: Router;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  const state: RouterStateSnapshot = {} as any;

  // We want to modify AuthService to allow us to return our own "account"
  const authService = jasmine.createSpyObj('AuthService', ['getAccountInfo'])
  let authSpy = authService.getAccountInfo.and.returnValue(of(getStudentInfoResponse))

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
          }
        },
        {
          provide: RouterStateSnapshot,
          useValue: {
            snapshot: {}
          }
        },
        {
          provide: AuthService,
          useValue: authService
        },
      ],
    });
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  // it should return true for student - student
  it('it should return true for student -> student', async () => {
    // Set our account type to student
    getStudentInfoResponse.success.accountData.userType = environment.studentType;
    const route: ActivatedRouteSnapshot = {
      data: {
        expectedRole: 'student',
      },
    } as any;

    const result$ = await executeGuard(route, state) as Observable<GuardResult>;
    const result = await firstValueFrom(result$);

    // Make sure that it was run
    expect(result).toBeTrue();
  });

  // it should return false for student - faculty
  it('it should return false for student -> faculty', async () => {
    getStudentInfoResponse.success.accountData.userType = environment.studentType;
    const route: ActivatedRouteSnapshot = {
      data: {
        expectedRole: 'faculty',
      },
    } as any;
    const parseUrlSpy = spyOn(router, 'parseUrl');

    const result$ = await executeGuard(route, state) as Observable<GuardResult>;
    const result = await firstValueFrom(result$);

    expect(result).not.toBeTrue();
    expect(parseUrlSpy).withContext('navigate to unauthorized').toHaveBeenCalledOnceWith('/unauthorized');
  });

  // it should return true for faculty - faculty
  it('it should return true for faculty -> faculty', async () => {
    getStudentInfoResponse.success.accountData.userType = environment.facultyType;
    const route: ActivatedRouteSnapshot = {
      data: {
        expectedRole: 'faculty',
      },
    } as any;

    const result$ = await executeGuard(route, state) as Observable<GuardResult>;
    const result = await firstValueFrom(result$);

    expect(result).toBeTrue();
  });

  // it should return false for faculty - student/industry (testing with student)
  it('it should return false for faculty -> student', async () => {
    getStudentInfoResponse.success.accountData.userType = environment.facultyType;
    const route: ActivatedRouteSnapshot = {
      data: {
        expectedRole: 'student',
      },
    } as any;
    const parseUrlSpy = spyOn(router, 'parseUrl');

    const result$ = await executeGuard(route, state) as Observable<GuardResult>;
    const result = await firstValueFrom(result$);

    expect(result).not.toBeTrue();
    expect(parseUrlSpy).withContext('navigate to unauthorized').toHaveBeenCalledOnceWith('/unauthorized');
  });

  // it should return true for industry - industry
  it('it should return true for industry -> industry', async () => {
    getStudentInfoResponse.success.accountData.userType = environment.industryType;
    const route: ActivatedRouteSnapshot = {
      data: {
        expectedRole: 'industry',
      },
    } as any;

    const result$ = await executeGuard(route, state) as Observable<GuardResult>;
    const result = await firstValueFrom(result$);

    expect(result).toBeTrue();
  });

  // it should return false for industry - student/faculty
  it('it should return false for industry -> faculty', async () => {
    getStudentInfoResponse.success.accountData.userType = environment.industryType;
    const route: ActivatedRouteSnapshot = {
      data: {
        expectedRole: 'faculty',
      },
    } as any;
    const parseUrlSpy = spyOn(router, 'parseUrl');

    const result$ = await executeGuard(route, state) as Observable<GuardResult>;
    const result = await firstValueFrom(result$);

    expect(result).not.toBeTrue();
    expect(parseUrlSpy).withContext('navigate to unauthorized').toHaveBeenCalledOnceWith('/unauthorized');
  });
});
