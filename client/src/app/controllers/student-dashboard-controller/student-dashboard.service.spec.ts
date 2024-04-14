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

  const httpClient = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put', 'delete']);
  let httpSpyGet = httpClient.get.and.returnValue(of(true));
  let httpSpyPost = httpClient.post.and.returnValue(of(true));
  let httpSpyPut = httpClient.put.and.returnValue(of(true))
  let httpSpyDelete = httpClient.delete.and.returnValue(of(true))

  let authService = jasmine.createSpyObj('AuthService', ['getHeaders', 'getMajors', 'getAccountInfo']);
  let authSpy = authService.getHeaders.and.returnValue(ExampleHttpHeaders)
  let authAccountInfo = authService.getAccountInfo.and.returnValue(of(getStudentInfoResponse));
  let authGetMajors = authService.getMajors.and.returnValue(of(true))

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HttpClient, 
          useValue: httpClient
        },
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    });
    service = TestBed.inject(StudentDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // service.deleteApplication
  it('should call /applications/deleteApplication', () => {
    const options = {
      headers: ExampleHttpHeaders,
      body: {
        "applicationID": '123456',
      }
    }
    service.deleteApplication(options.body.applicationID);
    expect(httpSpyDelete).toHaveBeenCalledWith(`${environment.apiUrl}/applications/deleteApplication`, options)
  })

  // service.getApplication
  it('should call /applications/getApplication', () => {
    const data = {
      "applicationID": '123456'
    }
    service.getApplication(data.applicationID);
    expect(httpSpyPost).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getApplication`, data, { headers: ExampleHttpHeaders })
  })
  
  // service.getAvailableMajors
  it('should call getMajors()', () => {
    service.getAvailableMajors('Purdue University Fort Wayne');
    expect(authGetMajors).toHaveBeenCalledWith('Purdue University Fort Wayne')
  })

  // service.getOpportunities
  it('should call /projects/getAllProjects', () => {
    service.getOpportunities();
    expect(httpSpyGet).toHaveBeenCalledWith(`${environment.apiUrl}/projects/getAllProjects`, { headers: ExampleHttpHeaders });
  })

  // service.getProjectInfo
  it('should call /applications/getProjectInfo', () => {
    const data = {
      "professorEmail": 'test@test.com',
      "projectID": '123456'
    }
    service.getProjectInfo(data.professorEmail, data.projectID);
    expect(httpSpyPost).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getProjectInfo`, data, { headers: ExampleHttpHeaders })
  })

  // service.getStudentApplications
  it('should call /applications/getApplications', () => {
    service.getStudentApplications();
    expect(httpSpyGet).toHaveBeenCalledWith(`${environment.apiUrl}/applications/getApplications`, { headers: ExampleHttpHeaders });
  })

  // service.getStudentInfo
  it('should call /accountManagement/getAccountInfo', () => {
    service.getStudentInfo();
    expect(httpSpyGet).toHaveBeenCalledWith(`${environment.apiUrl}/accountManagement/getAccountInfo`, { headers: ExampleHttpHeaders });
  })
  // service.updateApplication
  it('should call /applications/updateApplication', () => {
    const data = {
      "questions": { pretendThisIs: "AValidQuestion" },
      "applicationID": "123456"
    }
    service.updateApplication(data.applicationID, data.questions);
    expect(httpSpyPut).toHaveBeenCalledWith(`${environment.apiUrl}/applications/updateApplication`, data, { headers: ExampleHttpHeaders })
  })
});
