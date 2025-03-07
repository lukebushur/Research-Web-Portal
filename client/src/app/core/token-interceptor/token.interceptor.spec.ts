import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from 'environments/environment';
import { tokenInterceptor } from './token.interceptor';
import { AuthService } from 'app/controllers/auth-controller/auth.service';

describe('TokenInterceptor', () => {
  const KEY = 'jwt-auth-token';
  const TEST_URL = `${environment.apiUrl}/accountManagement/getAccountInfo`;
  let storedJwt: string | null;

  const interceptor: HttpInterceptorFn = (request, next) =>
    TestBed.runInInjectionContext(() => tokenInterceptor(request, next));
  let httpTesting: HttpTestingController;
  let authService: AuthService;

  // Store the previously set JWT token if one was set
  beforeAll(() => {
    storedJwt = localStorage.getItem(KEY);
  });

  // Test configuration
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  // Test that the tokenInterceptor is created
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  // Test that the Authorization header is added to the request when
  // the token is present in localStorage
  it('should create a request with the Authorization header set', async () => {
    const value = 'jwt-token';
    const body = 'header set';
    localStorage.setItem(KEY, value);

    const accountInfo$ = authService.getAccountInfo();
    const accountInfoPromise = firstValueFrom(accountInfo$);

    const req = httpTesting.expectOne(TEST_URL);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${value}`);

    req.flush(body);
    expect(await accountInfoPromise).toEqual(body);
  });

  // Test that the Authorization header is not added to the request when
  // the token is not present in localStorage
  it('should create a request without the Authorization header set', async () => {
    const body = 'header not set';
    localStorage.removeItem(KEY);

    const accountInfo$ = authService.getAccountInfo();
    const accountInfoPromise = firstValueFrom(accountInfo$);

    const req = httpTesting.expectOne(TEST_URL);
    expect(req.request.headers.get('Authorization')).toBeNull();

    req.flush(body);
    expect(await accountInfoPromise).toEqual(body);
  });

  // Verify that no unmatched requests are outstanding
  afterEach(() => {
    httpTesting.verify();
  });

  // Restore the JWT token value
  afterAll(() => {
    if (storedJwt) {
      localStorage.setItem(KEY, storedJwt);
    } else {
      localStorage.removeItem(KEY);
    }
  });
});
