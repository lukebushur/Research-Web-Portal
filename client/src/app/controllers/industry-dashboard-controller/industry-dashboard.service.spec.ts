import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { IndustryDashboardService } from './industry-dashboard.service';

describe('IndustryDashboardService', () => {
  let service: IndustryDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(IndustryDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
