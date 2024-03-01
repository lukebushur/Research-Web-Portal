import { TestBed } from '@angular/core/testing';

import { ProfileServiceService } from './profile-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileServiceService', () => {
  let service: ProfileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ProfileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
