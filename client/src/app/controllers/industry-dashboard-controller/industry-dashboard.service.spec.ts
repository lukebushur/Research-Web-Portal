import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { IndustryDashboardService } from './industry-dashboard.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from '../auth-controller/auth.service';

describe('IndustryDashboardService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authService: AuthService;
  let service: IndustryDashboardService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete']);
    authService = new AuthService();
    service = new IndustryDashboardService(httpClientSpy, authService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an object with arrays of jobs', (done: DoneFn) => {
    const expectedJobs = {
      success: {
        jobs: {
          active: [],
          draft: [],
          archived: [],
        }
      }
    };

    httpClientSpy.get.and.returnValue(of(expectedJobs));

    service.getJobs().subscribe({
      next: (data) => {
        expect(data).withContext('expected jobs').toEqual(expectedJobs);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('should return a successful response object', (done: DoneFn) => {
    const expectedResponse = {
      success: {
        status: 200,
        message: 'JOB_DELETED',
      }
    };    

    httpClientSpy.delete.and.returnValue(of(expectedResponse));

    service.deleteJob('1234').subscribe({
      next: (data) => {
        expect(data).withContext('expected resposne').toEqual(expectedResponse);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.delete.calls.count()).withContext('one call').toBe(1);
  });
});