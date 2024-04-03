import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to login', () => {
    const mockData = { username: 'testuser', password: 'testpassword' };
    const mockResponse = { success: true };

    service.login(mockData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should send a POST request to reset password', () => {
    const email = 'test@example.com';
    const mockResponse = { success: true };

    service.forgotPassword(email).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/accountManagement/resetPassword`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should send a POST request to confirm reset password', () => {
    const mockData = { email: 'test@example.com', newPassword: 'newpassword', resetToken: 'token' };
    const mockResponse = { success: true };

    service.confirmResetPassword(mockData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/accountManagement/confirmResetPassword`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
