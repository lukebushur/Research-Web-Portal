import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateJobService } from './create-job.service';

describe('CreateJobService', () => {
  let service: CreateJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CreateJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
