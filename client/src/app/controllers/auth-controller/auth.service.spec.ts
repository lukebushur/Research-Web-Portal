import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: jasmine.Spy;

  beforeEach(() => {

    const httpClient = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy = httpClient.get.and.returnValue(of(true))

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HttpClient,
          useValue: httpClient
        }
      ]
    });

    service = TestBed.inject(AuthService);
    localStorage.setItem('jwt-auth-token', "BackendIsBad")
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return headers properly with auth token', () => {
    const res = service.getHeaders()
    expect(res.get('Authorization')).toEqual(`Bearer ${localStorage.getItem('jwt-auth-token')}`);
  })

  it('should return jwt-auth-token', () => {
    const res = service.getAuthToken()
    expect(res).toEqual(localStorage.getItem('jwt-auth-token'))
  })

  it('should attempt to fetch accountInfo', () => {
    service.getAccountInfo()
    const args = httpSpy.calls.mostRecent().args;
    expect(args[0]).toBe(`${environment.apiUrl}/accountManagement/getAccountInfo`)
  })

  it('should fetch majors from my university', () => {
    service.getMajors('Test University')
    const args = httpSpy.calls.mostRecent().args;
    expect(args[0]).toBe(`${environment.apiUrl}/getMajors?university=${'Test University'}`)
  })

});
