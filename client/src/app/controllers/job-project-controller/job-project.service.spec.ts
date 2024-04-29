import { TestBed } from '@angular/core/testing';

import { JobProjectService } from './job-project.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JobProjectService', () => {
  let service: JobProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(JobProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
