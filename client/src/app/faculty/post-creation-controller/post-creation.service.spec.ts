import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PostCreationService } from './post-creation.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PostCreationService', () => {
  let service: PostCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PostCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
