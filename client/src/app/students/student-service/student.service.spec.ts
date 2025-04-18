import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { provideHttpClient } from '@angular/common/http';
import { SearchOptions } from 'app/students/models/searchOptions';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';
import { ApplyRequestData } from '../models/applyRequestData';
import { StudentProjectInfo, SuccessStudentProjectInfo } from '../models/student-project-info';
import { OverviewApplication } from '../models/applications-overview';

describe('StudentService', () => {
  const API_URL = environment.apiUrl;

  let service: StudentService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StudentService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a getOpportunities request', async () => {
    const flushBody = 'get opportunities';

    const opportunites$ = service.getOpportunities();
    const opportunites = firstValueFrom(opportunites$);

    const req = httpTesting.expectOne(`${API_URL}/projects/getAllProjects`);
    expect(req.request.method).toBe('GET');

    req.flush(flushBody);
    expect(await opportunites).toEqual(flushBody);
  });

  it('should send a searchProjects request', async () => {
    const options: SearchOptions = {
      query: 'namehahaha',
      posted: new Date(2024, 0, 1),
      deadline: new Date(2024, 2, 10),
      GPA: 2.1,
      majors: ['Computer Science', 'Mathematics'],
      npp: 10,
      pageNum: 1,
    };
    const flushResponse = 'search projects'

    const response$ = service.searchProjectsMultipleParams(options);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne((req) => req.url === `${API_URL}/search/searchProjects`);
    expect(req.request.params.get('query')).toEqual(options.query!);
    expect(req.request.params.get('posted')).toEqual(options.posted!.toISOString());
    expect(req.request.params.get('deadline')).toEqual(options.deadline!.toISOString());
    expect(req.request.params.get('GPA')).toEqual(options.GPA!.toString());
    expect(req.request.params.get('majors')).toEqual(options.majors!.join(','));
    expect(req.request.params.get('npp')).toEqual(options.npp!.toString());
    expect(req.request.params.get('pageNum')).toEqual(options.pageNum!.toString());
    expect(req.request.method).toBe('GET');

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a getProjectInfo request', async () => {
    const reqBody = {
      professorEmail: 'projectInfo@email.com',
      projectID: '849',
    };
    const project = {
      posted: new Date(2025, 2, 1),
      deadline: new Date(2025, 3, 1),
    } as StudentProjectInfo;
    const flushBody: SuccessStudentProjectInfo = {
      success: {
        status: 200,
        message: 'PROJECT_FOUND',
        project: project,
      }
    };

    const projectInfo$ = service.getProjectInfo(
      reqBody.professorEmail,
      reqBody.projectID
    );
    const projectInfo = firstValueFrom(projectInfo$);

    const req = httpTesting.expectOne(`${API_URL}/applications/getProjectInfo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reqBody);

    req.flush(flushBody);
    expect(await projectInfo).toEqual(project);
  });

  it('should send a createApplication request', async () => {
    const reqBody: ApplyRequestData = {
      professorEmail: 'create@application.com',
      projectID: '470',
      questions: [{
        question: 'Why do you want to create an application?',
        required: true,
        requirementType: 'text',
        answers: ['to do research'],
        questionNum: 1
      }],
    };
    const flushBody = 'create application';

    const createResponse$ = service.createApplication(reqBody);
    const createResponse = firstValueFrom(createResponse$);

    const req = httpTesting.expectOne(`${API_URL}/applications/createApplication`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reqBody);

    req.flush(flushBody);
    expect(await createResponse).toEqual(flushBody);
  });

  it('should send a getStudentApplications request', async () => {
    const flushBody = {
      success: {
        applications: [] as OverviewApplication[],
      }
    };

    const studentApplications$ = service.getStudentApplications();
    const studentApplications = firstValueFrom(studentApplications$);

    const req = httpTesting.expectOne(`${API_URL}/applications/getApplications`);
    expect(req.request.method).toBe('GET');

    req.flush(flushBody);
    expect(await studentApplications).toEqual(flushBody.success.applications);
  });

  it('should send a getApplication request', async () => {
    const reqBody = {
      applicationID: '128',
    };
    const flushBody = 'get application';

    const application$ = service.getApplication(reqBody.applicationID);
    const application = firstValueFrom(application$);

    const req = httpTesting.expectOne(`${API_URL}/applications/getApplication`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reqBody);

    req.flush(flushBody);
    expect(await application).toEqual(flushBody);
  });

  it('should send an updateApplication request', async () => {
    const reqBody = {
      questions: [{
        question: 'what is your name?',
        answer: 'RWP',
      }],
      applicationID: '578',
    };
    const flushBody = 'update application';

    const updateResponse$ = service.updateApplication(
      reqBody.applicationID,
      reqBody.questions
    );
    const updateResponse = firstValueFrom(updateResponse$);

    const req = httpTesting.expectOne(`${API_URL}/applications/updateApplication`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(reqBody);

    req.flush(flushBody);
    expect(await updateResponse).toEqual(flushBody);
  });

  it('should send a deleteApplication request', async () => {
    const reqBody = {
      applicationID: '748',
    };
    const flushBody = 'delete application';

    const deleteResponse$ = service.deleteApplication(reqBody.applicationID);
    const deleteResponse = firstValueFrom(deleteResponse$);

    const req = httpTesting.expectOne(`${API_URL}/applications/deleteApplication`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(reqBody);

    req.flush(flushBody);
    expect(await deleteResponse).toEqual(flushBody);
  });

  afterEach(() => {
    httpTesting.verify();
  });
});
