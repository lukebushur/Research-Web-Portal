import { TestBed } from '@angular/core/testing';

import { AssessmentsService } from './assessments.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AssessmentsService', () => {
  let service: AssessmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(AssessmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
