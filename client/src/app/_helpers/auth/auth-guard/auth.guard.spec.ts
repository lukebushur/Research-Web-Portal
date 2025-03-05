import { TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { Observable, of } from 'rxjs';

describe('AuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

  const router = jasmine.createSpyObj('Router', ['parseUrl'])
  let routerSpy = router.parseUrl.and.returnValue(of(true))

  beforeEach(() => {
    // Set our account token
    localStorage.setItem("jwt-auth-token", "123456")

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
      ]
    });
  });

  it('should be created', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    activatedRoute.snapshot.data = {
      expectedRole: "student"
    };

    const guardResponse = TestBed.runInInjectionContext(() => {
      return AuthGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    // If it's created then it's truthy so it works
    expect(guardResponse).toBeTruthy()
  });

  it('should navigate to /signup when token doesn\'t exists', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    // Set our account token to nothing
    localStorage.removeItem("jwt-auth-token")

    // Reset this spys calls
    router.parseUrl.calls.reset();

    // Create the role guard pass-through
    const guardResponse = TestBed.runInInjectionContext(() => {
      return AuthGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean | UrlTree>;
    });

    // Subscribe to its output
    let guardOutput = null;
    guardResponse.subscribe(response => guardOutput = response);

    // Make sure that it was run
    expect(guardOutput).toBeTruthy()
    expect(routerSpy).withContext('not navigate to signup').toHaveBeenCalledOnceWith('/signup');
  }))

  it('should return true when token exists', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute)

    // Reset this spys calls
    router.parseUrl.calls.reset();

    // Create the role guard pass-through
    const guardResponse = TestBed.runInInjectionContext(() => {
      return AuthGuard(activatedRoute.snapshot, {} as RouterStateSnapshot);
    });

    // Subscribe to its output
    let guardOutput = null;
    // For some god forsaken reason this returns as a boolean not as an observable that returns a boolean
    guardOutput = guardResponse;

    // Make sure that it was run
    expect(guardOutput).toBeTrue()
    expect(routerSpy).withContext('not navigate to signup').not.toHaveBeenCalledOnceWith('/signup');

    // Remove the token now, don't need it anymore!
    localStorage.removeItem("jwt-auth-token")
  }))

});
