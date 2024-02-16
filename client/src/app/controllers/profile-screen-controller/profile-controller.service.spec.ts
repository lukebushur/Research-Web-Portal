import { TestBed } from '@angular/core/testing';

import { ProfileControllerService } from './profile-controller.service';

describe('ProfileControllerService', () => {
  let service: ProfileControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
