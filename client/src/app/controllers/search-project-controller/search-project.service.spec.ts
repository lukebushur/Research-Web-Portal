import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchProjectService } from './search-project.service';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';
import { SearchOptions } from 'src/app/_models/searchOptions';

describe('SearchProjectService', () => {
  let service: SearchProjectService;
  let httpMock: HttpTestingController;

  const mockSearchOptions: SearchOptions = {
    query: 'mock query',
    majors: ['Computer Science', 'Electrical Engineering'],
    GPA: 3.5,
    npp: 5,
    pageNum: 1,
    posted: new Date('2024-01-01'),
    deadline: new Date('2024-04-01')
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchProjectService, AuthService]
    });
    service = TestBed.inject(SearchProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send search request with single parameter', () => {
    const queryParams = '?query=mock%20query&majors=Computer%20Science';
    
    service.searchProjectsSingleParams(queryParams).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/search/searchProjects` + queryParams);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
