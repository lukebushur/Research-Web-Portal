import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FacultyProjectService } from './faculty-project.service';

describe('FacultyProjectService', () => {
  let service: FacultyProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FacultyProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
