import { EmailService } from './email.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

describe('EmailService', () => {
  let emailService: EmailService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of(true))

    emailService = new EmailService(httpClientSpy);
  });

  it('should be created', () => {
    expect(emailService).toBeTruthy();
  });

  it('should send the email confirmation HttpPost', () => {
    emailService.confirmEmail('userId', 'emailToken');

    expect(httpClientSpy.post).toHaveBeenCalledOnceWith(
      `${environment.apiUrl}/confirmEmail`, {
        userId: 'userId',
        emailToken: 'emailToken',
      }
    );
  })
});
