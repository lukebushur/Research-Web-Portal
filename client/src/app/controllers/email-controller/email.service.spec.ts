import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmailService } from './email.service';
import { of } from 'rxjs';
import { AuthService } from '../auth-controller/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

describe('EmailService', () => {
  let service: EmailService;

  let authService;
  let authSpy: jasmine.Spy;
  
  let httpClient;
  let httpSpy: jasmine.Spy;

  const headerReply = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer 123456`,
  })

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getHeaders'])
    authSpy = authService.getHeaders.and.returnValue(headerReply)

    httpClient = jasmine.createSpyObj('HttpClient', ['post']);
    httpSpy = httpClient.post.and.returnValue(of(true))

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: HttpClient,
          useValue: httpClient
        },
        {
          provide: Router,
          useValue: {
            url: `/random_token`
          }
        }
      ]
    });
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get headers from authService', () => {
    service.confirmEmail();
    expect(authSpy).toHaveBeenCalled()
  })

  it('should send the email confirmation HttpPost', () => {
    service.confirmEmail();
    expect(httpSpy).toHaveBeenCalledOnceWith(`${environment.apiUrl}/api/confirmEmail`, {
      ["emailToken"]: 'random_token',
    }, { headers: headerReply })
  })
});
