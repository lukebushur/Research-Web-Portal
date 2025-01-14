import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AddEditJobService } from './add-edit-job.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddEditJobService', () => {
  let service: AddEditJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(AddEditJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
