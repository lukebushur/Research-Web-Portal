import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IndustryService } from './industry.service';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';

describe('IndustryService', () => {
  const API_URL = environment.apiUrl;

  let httpTesting: HttpTestingController;
  let service: IndustryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IndustryService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IndustryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a createJob request', async () => {
    const reqBody = {
      jobDetails: 'job details',
    };
    const flushResponse = 'create job';

    const response$ = service.createJob(reqBody);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/createJob`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(reqBody);

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a getJobs request', async () => {
    const flushResponse = 'get jobs';

    const response$ = service.getJobs();
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/getJobs`);
    expect(req.request.method).toBe('GET');

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a getJob request', async () => {
    const jobId = '123';
    const flushResponse = 'get job';

    const response$ = service.getJob(jobId);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/getJob/${jobId}`);
    expect(req.request.method).toBe('GET');

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send an editJob request', async () => {
    const reqBody = {
      jobDetails: 'edit job details',
    };
    const flushResponse = 'edit job';

    const response$ = service.editJob(reqBody);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/editJob`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(reqBody);

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a deleteJob request', async () => {
    const jobId = '123';

    const flushResponse = 'delete job';

    const response$ = service.deleteJob(jobId);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/deleteJob/${jobId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a createAssessment request', async () => {
    const reqBody = {
      assessmentDetails: 'assessment details',
    };
    const flushResponse = 'create assessment';

    const response$ = service.createAssessment(reqBody);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/createAssessment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(reqBody);

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a getAssessments request', async () => {
    const flushResponse = 'get assessments';

    const response$ = service.getAssessments();
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/getAssessments`);
    expect(req.request.method).toBe('GET');

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a getAssessment request', async () => {
    const assessmentId = '123';
    const flushResponse = 'get assessment';

    const response$ = service.getAssessment(assessmentId);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/getAssessment/${assessmentId}`);
    expect(req.request.method).toBe('GET');

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send an editAssessment request', async () => {
    const reqBody = {
      assessmentDetails: 'edit assessment details',
    };
    const flushResponse = 'edit assessment';

    const response$ = service.editAssessment(reqBody);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/editAssessment`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(reqBody);

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  it('should send a deleteAssessment request', async () => {
    const assessmentId = '123';

    const flushResponse = 'delete assessment';

    const response$ = service.deleteAssessment(assessmentId);
    const response = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${API_URL}/industry/deleteAssessment/${assessmentId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(flushResponse);
    expect(await response).toEqual(flushResponse);
  });

  afterEach(() => {
    httpTesting.verify();
  });
});
