import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AuthService } from '../../auth/auth-service/auth.service';
import { SearchProjectService } from './search-project.service';
import { provideHttpClient } from '@angular/common/http';
import { SearchOptions } from 'app/_models/searchOptions';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';

describe('SearchProjectService', () => {
  const API_URL = environment.apiUrl;

  let service: SearchProjectService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SearchProjectService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  afterEach(() => {
    httpTesting.verify();
  });
});
