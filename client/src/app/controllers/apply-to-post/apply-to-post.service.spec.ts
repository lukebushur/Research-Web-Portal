import { ApplyToPostService } from './apply-to-post.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { of } from 'rxjs';
import { ApplyRequestData } from 'app/_models/apply-to-post/applyRequestData';

describe('ApplyToPostService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authService: AuthService;
  let service: ApplyToPostService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    authService = new AuthService(httpClientSpy);
    service = new ApplyToPostService(httpClientSpy, authService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return project information', (done: DoneFn) => {
    const expectedResponse = {
      success: {
        project: {
          projectName: 'Test Project',
        }
      }
    };

    httpClientSpy.post.and.returnValue(of(expectedResponse));

    service.getProjectInfo({}).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(expectedResponse);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
  });

  it('should return application successfully created response', (done: DoneFn) => {
    const fakeApplyData: ApplyRequestData = {
      projectID: '123',
      professorEmail: 'fakeemail@email.com',
      questions: [],
    };
    const expectedResponse = {
      success: {
        status: 200,
        message: 'APPLICATION_CREATED',
      }
    };

    httpClientSpy.post.and.returnValue(of(expectedResponse));

    service.createApplication(fakeApplyData).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(expectedResponse);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
  });
});
