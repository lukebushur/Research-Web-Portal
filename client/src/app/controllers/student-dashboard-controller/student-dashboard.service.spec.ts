import { TestBed } from '@angular/core/testing';

import { StudentDashboardService } from './student-dashboard.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'environments/environment';

const exampleHttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: 'Bearer 123456',
});

const getStudentInfoResponse = {
  success: {
    status: 200,
    message: "ACCOUNT_FOUND",
    accountData: {
      email: "test@email.com",
      name: "Test Test",
      universityLocation: "Purdue University Fort Wayne",
      emailConfirmed: true,
      userType: environment.studentType,
      GPA: 3.0,
      Major: [
        "Major 1",
        "Major 2"
      ]
    }
  }
}

describe('StudentDashboardService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let studentDashboardService: StudentDashboardService;

  // Set up the test bed
  beforeEach(() => {
    // Create the spy objects
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put', 'delete']);
    httpClientSpy.get.and.returnValue(of(true));
    httpClientSpy.post.and.returnValue(of(true));
    httpClientSpy.put.and.returnValue(of(true))
    httpClientSpy.delete.and.returnValue(of(true))

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeaders', 'getMajors', 'getAccountInfo']);
    authServiceSpy.getHeaders.and.returnValue(exampleHttpHeaders)
    authServiceSpy.getAccountInfo.and.returnValue(of(getStudentInfoResponse));
    authServiceSpy.getMajors.and.returnValue(Promise.resolve(of(true)))

    studentDashboardService = new StudentDashboardService(httpClientSpy, authServiceSpy);
  });

  it('should be created', () => {
    // Check that the service was created
    expect(studentDashboardService).toBeTruthy();
  });

  // service.deleteApplication
  it('should call /applications/deleteApplication', () => {
    // Create the options object
    const options = {
      headers: exampleHttpHeaders,
      body: {
        "applicationID": '123456',
      }
    }
    // Call the function
    studentDashboardService.deleteApplication(options.body.applicationID);
    // Check that the function was called
    // with the correct parameters
    // and that it was called once
    expect(httpClientSpy.delete).toHaveBeenCalledWith(`${environment.apiUrl}/applications/deleteApplication`, options)
  })

  // service.getApplication
  it('should call /applications/getApplication', () => {
    // Create the data object
    const data = {
      "applicationID": '123456'
    }
    // Call the function
    studentDashboardService.getApplication(data.applicationID);
    // Check that the function was called
    expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getApplication`, data, { headers: exampleHttpHeaders })
  })

  // service.getAvailableMajors
  it('should call getMajors()', () => {
    // Call the function with a university
    studentDashboardService.getAvailableMajors('Purdue University Fort Wayne');
    // Check that the function was called with the correct parameters
    expect(authServiceSpy.getMajors).toHaveBeenCalledWith('Purdue University Fort Wayne')
  })

  // service.getOpportunities
  it('should call /projects/getAllProjects', () => {
    // Call the function
    studentDashboardService.getOpportunities();
    // Check that the function was called with the correct parameters
    // and that it was called once
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/projects/getAllProjects`, { headers: exampleHttpHeaders });
  })

  // service.getProjectInfo
  it('should call /applications/getProjectInfo', () => {
    // Create the data object
    const data = {
      "professorEmail": 'test@test.com',
      "projectID": '123456'
    }
    // Call the function
    studentDashboardService.getProjectInfo(data.professorEmail, data.projectID);
    // Check that the function was called with the correct parameters
    expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getProjectInfo`, data, { headers: exampleHttpHeaders })
  })

  // service.getStudentApplications
  it('should call /applications/getApplications', () => {
    // Call the function
    studentDashboardService.getStudentApplications();
    // Check that the function was called with the correct parameters
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getApplications`, { headers: exampleHttpHeaders });
  })

  // service.getStudentInfo
  it('should call /accountManagement/getAccountInfo', () => {
    // Call the function
    studentDashboardService.getStudentInfo();
    // Check that the function was called with the correct parameters
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/accountManagement/getAccountInfo`, { headers: exampleHttpHeaders });
  })
  // service.updateApplication
  it('should call /applications/updateApplication', () => {
    // Create the data object
    const data = {
      "questions": { pretendThisIs: "AValidQuestion" },
      "applicationID": "123456"
    }
    // Call the function
    studentDashboardService.updateApplication(data.applicationID, data.questions);
    // Check that the function was called with the correct parameters
    expect(httpClientSpy.put).toHaveBeenCalledWith(`${environment.apiUrl}/applications/updateApplication`, data, { headers: exampleHttpHeaders })
  })
});
