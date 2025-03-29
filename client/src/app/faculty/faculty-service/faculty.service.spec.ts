import { FacultyService } from './faculty.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

describe('FacultyService', () => {
  let service: FacultyService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    // mock services to instantiate and test FacultyService
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new FacultyService(httpSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return successful createPost response', (done: DoneFn) => {
    const testData = {
      projectID: '0',
      projectType: 'Active',
    };
    const response = {
      success: {
        status: 201,
      }
    };
    httpSpy.post.and.returnValue(of(response));

    service.createPost(testData).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(response);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.post).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/createProject`,
      testData,
    );
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
    expect(httpSpy.get).toHaveBeenCalledOnceWith(`${apiUrl}/projects/getProjects`);
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
    );
  });

  it('should return successful fetchApplicant response', (done: DoneFn) => {
    const projectID = '0';
    const applicationID = '1';
    const processedResponse = {
      projectData: {
        posted: new Date(),
        deadline: new Date(),
      },
      applicantData: {
        appliedDate: new Date(),
      },
    };
    const response = {
      success: {
        status: 200,
        responseData: {
          projectData: {
            posted: processedResponse.projectData.posted.toISOString(),
            deadline: processedResponse.projectData.deadline.toISOString(),
          },
          applicantData: {
            appliedDate: processedResponse.applicantData.appliedDate.toISOString(),
          },
        }
      }
    };

    httpSpy.post.and.returnValue(of(response));

    service.fetchApplicant(projectID, applicationID).subscribe({
      next: (data: any) => {
        expect(data).withContext('expected response').toEqual(processedResponse);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.post).toHaveBeenCalledOnceWith(
      `${apiUrl}/projects/getApplicant`,
      { projectID, applicationID },
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
    );
  });
});
