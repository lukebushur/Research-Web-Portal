import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PostCreationService } from './post-creation.service';

describe('PostCreationService', () => {
  let service: PostCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PostCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
