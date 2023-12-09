import { TestBed } from '@angular/core/testing';

import { TableDataSharingService } from './table-data-sharing.service';

describe('TableDataSharingService', () => {
  let service: TableDataSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableDataSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
