import { TestBed } from '@angular/core/testing';

import { FacultyProjectService } from './faculty-project.service';

describe('FacultyProjectService', () => {
  let service: FacultyProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
