import { TestBed } from '@angular/core/testing';

import { StudentDashboardService } from './student-dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StudentDashboardService', () => {
  let service: StudentDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(StudentDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
