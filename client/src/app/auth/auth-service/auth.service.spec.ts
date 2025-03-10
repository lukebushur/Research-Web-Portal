import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmResetPasswordBody, LoginBody } from '../models/request-bodies';

describe('AuthService', () => {
  const API_URL = environment.apiUrl;

  let httpTesting: HttpTestingController;
  let authService: AuthService;

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
  })

  it('should attempt to fetch accountInfo', async () => {
    const body = 'account info';

    const accountInfo$ = authService.getAccountInfo();
    const accountInfoPromise = firstValueFrom(accountInfo$);

    const req = httpTesting.expectOne(`${API_URL}/accountManagement/getAccountInfo`);
    expect(req.request.method).toBe('GET');

    req.flush(body);
    expect(await accountInfoPromise).toEqual(body);
  });

  it('should fetch majors from the university retrieved from getAccountInfo', async () => {
    const university = 'account PFW';
    const accountInfo = {
      success: {
        accountData: {
          universityLocation: university,
        },
      },
    };
    const body = 'majors from account info';

    const majors$ = authService.getMajors();
    const majorsPromise = firstValueFrom(majors$);

    const accountInfoReq = httpTesting.expectOne(`${API_URL}/accountManagement/getAccountInfo`);
    accountInfoReq.flush(accountInfo);

    const majorsReq = httpTesting.expectOne(`${API_URL}/getMajors?university=${university}`);
    expect(majorsReq.request.method).toBe('GET');

    majorsReq.flush(body);
    expect(await majorsPromise).toEqual(body);
  });

  it('should fetch majors from the given university', async () => {
    const university = 'PFW';
    const body = 'majors';

    const majors$ = authService.getMajors(university);
    const majorsPromise = firstValueFrom(majors$);

    const req = httpTesting.expectOne(`${API_URL}/getMajors?university=${university}`);
    expect(req.request.method).toBe('GET');

    req.flush(body);
    expect(await majorsPromise).toEqual(body);
  });

  afterEach(() => {
    httpTesting.verify();
  });
});
