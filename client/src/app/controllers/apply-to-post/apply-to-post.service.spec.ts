import { TestBed } from '@angular/core/testing';

import { ApplyToPostService } from './apply-to-post.service';

describe('ApplyToPostService', () => {
  let service: ApplyToPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyToPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
