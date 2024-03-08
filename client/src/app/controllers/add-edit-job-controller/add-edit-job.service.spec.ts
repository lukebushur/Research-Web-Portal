import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddEditJobService } from './add-edit-job.service';

describe('AddEditJobService', () => {
  let service: AddEditJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AddEditJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
