import { SignupService } from './signup.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { of } from 'rxjs';

describe('SignupService', () => {
  let authService: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: SignupService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    authService = new AuthService(httpClientSpy);
    service = new SignupService(httpClientSpy, authService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return signup successful response', (done: DoneFn) => {
    const response = {
      success: {
        status: 200,
        message: 'REGISTER_SUCCESS'
      }
    }

    httpClientSpy.post.and.returnValue(of(response));

    service.signup({}).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.post).toHaveBeenCalled();
  });
});
