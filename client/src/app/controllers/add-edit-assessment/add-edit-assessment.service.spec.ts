import { TestBed } from '@angular/core/testing';

import { AddEditAssessmentService } from './add-edit-assessment.service';

describe('AddEditAssessmentService', () => {
  let service: AddEditAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddEditAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
