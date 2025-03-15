import { TestBed } from '@angular/core/testing';

import { loadingInterceptor, SKIP_LOADING } from './loading.interceptor';
import { firstValueFrom } from 'rxjs';
import { LoaderService } from '../../shared/loader-service/loader.service';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'environments/environment';
import { IndustryService } from 'app/industry/industry-service/industry.service';

describe('loadingInterceptor', () => {
  const TEST_URL = `${environment.apiUrl}/industry/getJobs`;

  const interceptor: HttpInterceptorFn = (request, next) =>
    TestBed.runInInjectionContext(() => loadingInterceptor(request, next));
  let httpTesting: HttpTestingController;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let industryService: IndustryService;

  beforeEach(() => {
    // mock loaderService to test just whether the methods were called
    loaderService = jasmine.createSpyObj<LoaderService>('LoaderService', [
      'incrementRequests',
      'decrementRequests',
    ]);
    loaderService.incrementRequests.and.returnValue();
    loaderService.decrementRequests.and.returnValue();

    TestBed.configureTestingModule({
      providers: [
        IndustryService,
        { provide: LoaderService, useValue: loaderService },
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    industryService = TestBed.inject(IndustryService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should load and stop loading when a request is sent and completes', async () => {
    const body = {
      data: 'get jobs',
    };

    const jobs$ = industryService.getJobs(false);
    const jobs = firstValueFrom(jobs$);

    const req = httpTesting.expectOne(TEST_URL);
    expect(loaderService.incrementRequests).toHaveBeenCalledOnceWith();
    expect(req.request.context.get(SKIP_LOADING)).toBe(false);

    req.flush(body);
    expect(await jobs).toEqual(body);
    expect(loaderService.decrementRequests).toHaveBeenCalledOnceWith();
  });

  it('should skip loading when the SKIP_LOADING token is set to true', async () => {
    const body = {
      data: 'get jobs',
    };

    const jobs$ = industryService.getJobs(true);
    const jobs = firstValueFrom(jobs$);

    const req = httpTesting.expectOne(TEST_URL);
    expect(loaderService.incrementRequests).not.toHaveBeenCalledOnceWith();
    expect(req.request.context.get(SKIP_LOADING)).toBe(true);

    req.flush(body);
    expect(await jobs).toEqual(body);
    expect(loaderService.decrementRequests).not.toHaveBeenCalledOnceWith();
  });
});
