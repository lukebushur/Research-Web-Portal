import { TestBed } from '@angular/core/testing';

import { AssessmentsService } from './assessments.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssessmentsService', () => {
  let service: AssessmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AssessmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
