import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmResetPasswordBody, LoginBody, SignupBody } from '../models/request-bodies';
import { restoreTokens, saveTokens, Tokens } from 'app/helpers/testing/token-storage';

describe('AuthService', () => {
  const API_URL = environment.apiUrl;

  const KEY = 'jwt-auth-token';
  let tokens: Tokens;
  const randomToken = '1234567890';

  let httpTesting: HttpTestingController;
  let authService: AuthService;

  beforeAll(() => {
    tokens = saveTokens();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should return signup successful response', async () => {
    const body: SignupBody = {
      name: 'signup name',
      email: 'signup@email.com',
      password: 'signupPassword123',
      universityLocation: 'signup university',
      accountType: 1,
    };
    const flushBody = 'signup response';

    const signupResponse$ = authService.signup(body);
    const signupResponse = firstValueFrom(signupResponse$);

    const req = httpTesting.expectOne(`${API_URL}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(flushBody);
    expect(await signupResponse).toEqual(flushBody);
  });

  it('should send an email confirmation request', async () => {
    const body = {
      userId: 'userId',
      emailToken: 'emailToken',
    };
    const flushBody = 'confirm email';

    const confirmResponse$ = authService.confirmEmail(body.userId, body.emailToken);
    const confirmResponse = firstValueFrom(confirmResponse$);

    const req = httpTesting.expectOne(`${API_URL}/confirmEmail`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(flushBody);
    expect(await confirmResponse).toEqual(flushBody);
  });

  it('should send a login request', async () => {
    const body: LoginBody = {
      email: 'login@email.com',
      password: 'loginPassword123',
    };
    const flushBody = 'login';

    const loginResponse$ = authService.login(body);
    const loginResponse = firstValueFrom(loginResponse$);

    const req = httpTesting.expectOne(`${API_URL}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(flushBody);
    expect(await loginResponse).toEqual(flushBody);
  });

  it('should send a forgot password request', async () => {
    const email = 'forgotpassword@email.com';
    const flushBody = 'forgot password';

    const forgotPasswordResponse$ = authService.forgotPassword(email);
    const forgotPasswordResponse = firstValueFrom(forgotPasswordResponse$);

    const req = httpTesting.expectOne(`${API_URL}/accountManagement/resetPassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });

    req.flush(flushBody);
    expect(await forgotPasswordResponse).toEqual(flushBody);
  });

  it('should send a confirm reset password request', async () => {
    const body: ConfirmResetPasswordBody = {
      email: 'confirmresetpassword@email.com',
      passwordResetToken: 'resetToken',
      provisionalPassword: 'newConfirmPassword123',
    };
    const flushBody = 'forgot password';

    const confirmResetPasswordResponse$ = authService.confirmResetPassword(body);
    const confirmResetPasswordResponse = firstValueFrom(confirmResetPasswordResponse$);

    const req = httpTesting.expectOne(`${API_URL}/accountManagement/confirmResetPassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(flushBody);
    expect(await confirmResetPasswordResponse).toEqual(flushBody);
  });

  it('should sign out the user', () => {
    localStorage.setItem(KEY, randomToken);

    authService.signout();

    expect(localStorage.getItem(KEY)).toBeNull();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  afterAll(() => {
    restoreTokens(tokens);
  });
});
