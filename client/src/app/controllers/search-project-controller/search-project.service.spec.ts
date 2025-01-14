import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AuthService } from '../auth-controller/auth.service';
import { SearchProjectService } from './search-project.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SearchProjectService', () => {
  let service: SearchProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [AuthService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] // Provide any required dependencies, such as AuthService
    });
    service = TestBed.inject(SearchProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
