import { AuthService } from './auth.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { environment } from 'environments/environment';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

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

  it('should attempt to fetch accountInfo', async () => {
    const body = 'account info';

    const accountInfo$ = authService.getAccountInfo();
    const accountInfoPromise = firstValueFrom(accountInfo$);

    const req = httpTesting.expectOne(`${API_URL}/accountManagement/getAccountInfo`);
    expect(req.request.method).toBe('GET');

    req.flush(body);
    expect(await accountInfoPromise).toEqual(body);
  });

  it('should return jwt-auth-token', () => {
    const res = authService.getAuthToken()

    expect(res).toEqual(localStorage.getItem('jwt-auth-token'))
  })

  it('should attempt to fetch accountInfo', () => {
    authService.getAccountInfo()
    const args = httpClientSpy.get.calls.mostRecent().args;

    expect(args[0]).toBe(`${environment.apiUrl}/accountManagement/getAccountInfo`)
  })

  it('should fetch majors from my university', () => {
    authService.getMajors('Test University')
    const args = httpClientSpy.get.calls.mostRecent().args;

    expect(args[0]).toBe(`${environment.apiUrl}/getMajors?university=${'Test University'}`)
  })
});
