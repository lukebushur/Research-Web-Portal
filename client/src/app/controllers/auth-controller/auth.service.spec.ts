import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

describe('AuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authService: AuthService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(of(true));

    authService = new AuthService(httpClientSpy);

    localStorage.setItem('jwt-auth-token', "invalid")
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should return headers properly with auth token', () => {
    const res = authService.getHeaders()

    expect(res.get('Authorization')).toEqual(`Bearer ${localStorage.getItem('jwt-auth-token')}`);
  })

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
