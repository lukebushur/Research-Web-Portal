import { ApplyToPostService } from './apply-to-post.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApplyRequestData } from 'app/students/models/applyRequestData';

describe('ApplyToPostService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: ApplyToPostService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new ApplyToPostService(httpClientSpy);
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
