import { TestBed } from '@angular/core/testing';

import { StudentDashboardService } from './student-dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';

const ExampleHttpHeaders = of(new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${'123456'}`,
}))

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
  let service: StudentDashboardService;

  // Create the spy objects
  const httpClient = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put', 'delete']);
  let httpSpyGet = httpClient.get.and.returnValue(of(true));
  let httpSpyPost = httpClient.post.and.returnValue(of(true));
  let httpSpyPut = httpClient.put.and.returnValue(of(true))
  let httpSpyDelete = httpClient.delete.and.returnValue(of(true))

  // Create the spy objects
  let authService = jasmine.createSpyObj('AuthService', ['getHeaders', 'getMajors', 'getAccountInfo']);
  let authSpy = authService.getHeaders.and.returnValue(ExampleHttpHeaders)
  let authAccountInfo = authService.getAccountInfo.and.returnValue(of(getStudentInfoResponse));
  let authGetMajors = authService.getMajors.and.returnValue(of(true))

  // Set up the test bed
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        // Provide the service overrides so we can spy on stuff
        // Provide the http client
        {
          provide: HttpClient, 
          useValue: httpClient
        },
        // Provide the auth service
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    });
    // Create the service
    service = TestBed.inject(StudentDashboardService);
  });

  it('should be created', () => {
    // Check that the service was created
    expect(service).toBeTruthy();
  });

  // service.deleteApplication
  it('should call /applications/deleteApplication', () => {
    // Create the options object
    const options = {
      headers: ExampleHttpHeaders,
      body: {
        "applicationID": '123456',
      }
    }
    // Call the function
    service.deleteApplication(options.body.applicationID);
    // Check that the function was called
    // with the correct parameters
    // and that it was called once
    expect(httpSpyDelete).toHaveBeenCalledWith(`${environment.apiUrl}/applications/deleteApplication`, options)
  })

  // service.getApplication
  it('should call /applications/getApplication', () => {
    // Create the data object
    const data = {
      "applicationID": '123456'
    }
    // Call the function
    service.getApplication(data.applicationID);
    // Check that the function was called
    expect(httpSpyPost).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getApplication`, data, { headers: ExampleHttpHeaders })
  })
  
  // service.getAvailableMajors
  it('should call getMajors()', () => {
    // Call the function with a university
    service.getAvailableMajors('Purdue University Fort Wayne');
    // Check that the function was called with the correct parameters
    expect(authGetMajors).toHaveBeenCalledWith('Purdue University Fort Wayne')
  })

  // service.getOpportunities
  it('should call /projects/getAllProjects', () => {
    // Call the function
    service.getOpportunities();
    // Check that the function was called with the correct parameters 
    // and that it was called once
    expect(httpSpyGet).toHaveBeenCalledWith(`${environment.apiUrl}/projects/getAllProjects`, { headers: ExampleHttpHeaders });
  })

  // service.getProjectInfo
  it('should call /applications/getProjectInfo', () => {
    // Create the data object
    const data = {
      "professorEmail": 'test@test.com',
      "projectID": '123456'
    }
    // Call the function
    service.getProjectInfo(data.professorEmail, data.projectID);
    // Check that the function was called with the correct parameters
    expect(httpSpyPost).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getProjectInfo`, data, { headers: ExampleHttpHeaders })
  })

  // service.getStudentApplications
  it('should call /applications/getApplications', () => {
    // Call the function
    service.getStudentApplications();
    // Check that the function was called with the correct parameters
    expect(httpSpyGet).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getApplications`, { headers: ExampleHttpHeaders });
  })

  // service.getStudentInfo
  it('should call /accountManagement/getAccountInfo', () => {
    // Call the function
    service.getStudentInfo();
    // Check that the function was called with the correct parameters
    expect(httpSpyGet).toHaveBeenCalledWith(`${environment.apiUrl}/accountManagement/getAccountInfo`, { headers: ExampleHttpHeaders });
  })
  // service.updateApplication
  it('should call /applications/updateApplication', () => {
    // Create the data object
    const data = {
      "questions": { pretendThisIs: "AValidQuestion" },
      "applicationID": "123456"
    }
    // Call the function
    service.updateApplication(data.applicationID, data.questions);
    // Check that the function was called with the correct parameters
    expect(httpSpyPut).toHaveBeenCalledWith(`${environment.apiUrl}/applications/updateApplication`, data, { headers: ExampleHttpHeaders })
  })
});
