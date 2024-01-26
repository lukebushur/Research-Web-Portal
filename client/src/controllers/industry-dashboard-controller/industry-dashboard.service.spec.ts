import { TestBed } from '@angular/core/testing';

import { IndustryDashboardService } from './industry-dashboard.service';

describe('IndustryDashboardService', () => {
  let service: IndustryDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndustryDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
