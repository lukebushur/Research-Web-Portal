import { TestBed } from '@angular/core/testing';

import { FacultyProjectService } from './faculty-project.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

describe('FacultyProjectService', () => {
  let service: FacultyProjectService;
  let authService: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    // mock services to instantiate and test FacultyProjectService
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    authService = new AuthService(httpSpy);
    service = new FacultyProjectService(httpSpy, authService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return successful getProjects response', (done: DoneFn) => {
    const response = {
      success: {
        status: 200,
      }
    }
    httpSpy.get.and.returnValue(of(response));

    service.getProjects().subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.get).toHaveBeenCalledOnceWith(`${apiUrl}/projects/getProjects`, jasmine.any(Object));
  });

  it('should return successful getProject response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
      projectType: 'Active',
    };
    const response = {
      success: {
        status: 200,
      }
    };
    httpSpy.post.and.returnValue(of(response));

    service.getProject(testData.projectID, testData.projectType).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.post).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/getProject`,
      testData,
      jasmine.any(Object)
    );
  });

  it('should return successful deleteProject response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
      projectType: 'Active',
    };
    const response = {
      success: {
        status: 200,
      }
    }
    httpSpy.delete.and.returnValue(of(response));

    service.deleteProject(testData.projectID, testData.projectType).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.delete).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/deleteProject`,
      {
        headers: jasmine.any(Object),
        body: testData,
      }
    );
  });

  it('should return successful archiveProject response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
    };
    const response = {
      success: {
        status: 200,
      }
    };
    httpSpy.put.and.returnValue(of(response));

    service.archiveProject(testData.projectID).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/archiveProject`,
      testData,
      jasmine.any(Object)
    );
  });

  it('should return successful updateProject response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
    };
    const response = {
      success: {
        status: 200,
      }
    };
    httpSpy.put.and.returnValue(of(response));

    service.updateProject(testData).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/updateProject`,
      testData,
      jasmine.any(Object)
    );
  });

  it('should return successful publishDraft response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
    };
    const response = {
      success: {
        status: 200,
      }
    };
    httpSpy.put.and.returnValue(of(response));

    service.publishDraft(testData.projectID).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/publishDraft`,
      testData,
      jasmine.any(Object)
    );
  });

  it('should return successful fetchApplicant response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
      applicationID: '1',
    };
    const response = {
      success: {
        status: 200,
      }
    };
    httpSpy.post.and.returnValue(of(response));

    service.fetchApplicant(testData.projectID, testData.applicationID).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.post).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/getApplicant`,
      testData,
      jasmine.any(Object)
    );
  });

  it('should return successful applicationDecision response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
      applicationID: '1',
      decision: 'Accept',
    };
    const response = {
      success: {
        status: 200,
      }
    };
    httpSpy.put.and.returnValue(of(response));

    service.applicationDecision(testData).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/application`,
      testData,
      jasmine.any(Object)
    );
  });

  it('should return successful applicationDecide response', () => {
    const testData = {
      projectID: '0',
      applicationID: '1',
      decision: 'Reject',
    };
    const applicationDecisionSpy = spyOn(service, 'applicationDecision');

    service.applicationDecide(testData.applicationID, testData.projectID, testData.decision);
    expect(applicationDecisionSpy).toHaveBeenCalledWith(testData);
  });

  it('should return successful detailedFetchApplicants response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
    };
    const response = {
      success: {
        status: 200,
      }
    };
    httpSpy.post.and.returnValue(of(response));

    service.detailedFetchApplicants(testData.projectID).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.post).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/getDetailedApplicants`,
      testData,
      jasmine.any(Object)
    );
  });
});
