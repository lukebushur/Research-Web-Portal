import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, provideRouter, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { restoreTokens, saveTokens, Tokens } from 'app/helpers/testing/token-storage';

describe('authGuard', () => {
  const KEY = 'jwt-auth-token';
  let tokens: Tokens;

  let router: Router;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  // Save the current token if there is one
  beforeAll(() => {
    tokens = saveTokens();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
      ],
    });
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should navigate to /login when token does not exist', async () => {
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;

    // Remove our account token
    localStorage.removeItem(KEY);

    const parseUrlSpy = spyOn(router, 'parseUrl');

    const result = await executeGuard(route, state);

    // Make sure that it redirects to login
    expect(result).not.toBeTrue();
    expect(parseUrlSpy).withContext('redirect to login').toHaveBeenCalledOnceWith('/login');
  });

  it('should return true when token exists', async () => {
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;

    // Set the account token
    localStorage.setItem(KEY, '123456');

    const result = await executeGuard(route, state);

    // Make sure that the guard returns true
    expect(result).toBeTrue();
  });

  // Restore the previous token
  afterAll(() => {
    restoreTokens(tokens);
  });
});
