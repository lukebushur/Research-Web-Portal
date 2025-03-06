import { TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { roleGuard } from './role.guard';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/controllers/auth-controller/auth.service';

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
  let service: any;

  // We want to modify AuthService to allow us to return our own "account"
  const authService = jasmine.createSpyObj('AuthService', ['getAccountInfo'])
  let authSpy = authService.getAccountInfo.and.returnValue(of(getStudentInfoResponse))

  // This is used for the navigate spy
  const router = jasmine.createSpyObj('Router', ['navigate'])
  let routerSpy = router.navigate.and.returnValue(of(true))

  //let service;
  let guard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
          }
        },
        {
          provide: Router,
          useValue: router
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
      ]
    });
  });

  it('should be created', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    activatedRoute.snapshot.data = {
      expectedRole: "student"
    };

    const guardResponse = TestBed.runInInjectionContext(() => {
      return roleGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    // If it's created then it's truthy so it works
    expect(guardResponse).toBeTruthy()
  });

  // it should return true for student - student
  it('it should return true for student -> student', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    // Set our account type to student
    getStudentInfoResponse.success.accountData.userType = environment.studentType
    activatedRoute.snapshot.data = {
      expectedRole: "student"
    };

    // Reset this spys calls
    router.navigate.calls.reset();

    // Create the role guard pass-through
    const guardResponse = TestBed.runInInjectionContext(() => {
      return roleGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    // Subscribe to its output
    let guardOutput = null;
    guardResponse.subscribe(response => guardOutput = response);

    // Make sure that it was run
    expect(guardOutput).toBeTruthy()
    expect(routerSpy).withContext('not navigate to unauthorized').not.toHaveBeenCalled();
  }));

  // it should return false for student - faculty
  it('it should return false for student -> faculty', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    getStudentInfoResponse.success.accountData.userType = environment.studentType
    activatedRoute.snapshot.data = {
      expectedRole: "faculty"
    };

    router.navigate.calls.reset();

    const guardResponse = TestBed.runInInjectionContext(() => {
      return roleGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    let guardOutput = null;
    guardResponse.subscribe(response => guardOutput = response);

    expect(guardOutput).toBeFalse()
    expect(routerSpy).withContext('navigate to unauthorized').toHaveBeenCalledOnceWith(['/unauthorized']);
  }));

  // it should return true for faculty - faculty
  it('it should return true for faculty -> faculty', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    getStudentInfoResponse.success.accountData.userType = environment.facultyType
    activatedRoute.snapshot.data = {
      expectedRole: "faculty"
    };

    router.navigate.calls.reset();

    const guardResponse = TestBed.runInInjectionContext(() => {
      return roleGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    let guardOutput = null;
    guardResponse.subscribe(response => guardOutput = response);

    expect(guardOutput).toBeTrue()
    expect(routerSpy).withContext('not navigate to unauthorized').not.toHaveBeenCalled();
  }));

  // it should return false for faculty - student/industry (testing with student)
  it('it should return false for faculty -> student', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    getStudentInfoResponse.success.accountData.userType = environment.facultyType
    activatedRoute.snapshot.data = {
      expectedRole: "student"
    };

    router.navigate.calls.reset();

    const guardResponse = TestBed.runInInjectionContext(() => {
      return roleGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    let guardOutput = null;
    guardResponse.subscribe(response => guardOutput = response);

    expect(guardOutput).toBeFalse()
    expect(routerSpy).withContext('navigate to unauthorized').toHaveBeenCalledOnceWith(['/unauthorized']);
  }));

  // it should return true for industry - industry
  it('it should return true for industry -> industry', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    getStudentInfoResponse.success.accountData.userType = environment.industryType
    activatedRoute.snapshot.data = {
      expectedRole: "industry"
    };

    router.navigate.calls.reset();

    const guardResponse = TestBed.runInInjectionContext(() => {
      return roleGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    let guardOutput = null;
    guardResponse.subscribe(response => guardOutput = response);

    expect(guardOutput).toBeTrue()
    expect(routerSpy).withContext('not navigate to unauthorized').not.toHaveBeenCalled();
  }));

  // it should return false for industry - student/faculty
  it('it should return false for industry -> faculty', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    getStudentInfoResponse.success.accountData.userType = environment.industryType
    activatedRoute.snapshot.data = {
      expectedRole: "faculty"
    };

    router.navigate.calls.reset();

    const guardResponse = TestBed.runInInjectionContext(() => {
      return roleGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    let guardOutput = null;
    guardResponse.subscribe(response => guardOutput = response);

    expect(guardOutput).toBeFalse()
    expect(routerSpy).withContext('navigate to unauthorized').toHaveBeenCalledOnceWith(['/unauthorized']);
  }));
});
