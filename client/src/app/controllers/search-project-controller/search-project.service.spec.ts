import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AuthService } from '../auth-controller/auth.service';
import { SearchProjectService } from './search-project.service';

describe('SearchProjectService', () => {
  let service: SearchProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [AuthService] // Provide any required dependencies, such as AuthService
    });
    service = TestBed.inject(SearchProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
