import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EmailService } from './email.service';
import { of } from 'rxjs';
import { AuthService } from '../auth-controller/auth.service';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

describe('EmailService', () => {
  let emailService: EmailService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const headerReply = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123456',
  })

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of(true))

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeaders'])
    authServiceSpy.getHeaders.and.returnValue(headerReply)

    emailService = new EmailService(httpClientSpy, authServiceSpy);
  });

  it('should be created', () => {
    expect(emailService).toBeTruthy();
  });

  it('should get headers from authService', () => {
    emailService.confirmEmail('emailToken');

    expect(authServiceSpy.getHeaders).toHaveBeenCalled()
  })

  it('should send the email confirmation HttpPost', () => {
    emailService.confirmEmail('emailToken');

    expect(httpClientSpy.post).toHaveBeenCalledOnceWith(`${environment.apiUrl}/confirmEmail`, {
      emailToken: 'emailToken',
    }, {
      headers: headerReply
    });
  })
});
