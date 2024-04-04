import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostCreationService } from './post-creation.service';
import { AuthService } from '../auth-controller/auth.service';
import { Observable, of } from 'rxjs';

// Mock AuthService
class MockAuthService {
  getHeaders(): any {
    return { /* Mock headers */ };
  }
}

describe('PostCreationService', () => {
  let service: PostCreationService;
  let httpMock: HttpTestingController;

  const mockPostData = {
    title: 'Mock Project',
    description: 'This is a mock project description',
    category: 'Mock Category',
  };

  const mockResponse = {
    success: true,
    message: 'Project created successfully',
    project: {
      id: 'mock_project_id',
      title: 'Mock Project',
    }
  };
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostCreationService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });
    service = TestBed.inject(PostCreationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createPost API with correct data and headers', () => {
    const postData = { mockPostData };

    service.createPost(postData).subscribe(response => {
      expect(mockResponse).toEqual(mockResponse); // Assert response
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/projects/createProject`);
    expect(req.request.method).toBe('POST'); // Assert request method
    expect(req.request.body).toEqual(postData); // Assert request body
    req.flush(mockResponse); // Flush mock response
  });

  it('should handle errors when createPost API fails', () => {
    const postData = { mockPostData };
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };

    service.createPost(postData).subscribe({
      next: () => fail('Expected an error, but got a successful response'),
      error: (error) => {
        expect(error.status).toEqual(errorResponse.status); // Assert error status
        expect(error.statusText).toEqual(errorResponse.statusText); // Assert error status text
      }
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/projects/createProject`);
    req.flush({}, errorResponse); // Flush with error response
  });
});
