import { TestBed } from '@angular/core/testing';

import { SearchProjectsService } from './search-projects.service';

describe('SearchProjectsService', () => {
  let service: SearchProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
