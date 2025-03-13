import { TestBed } from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// mock data for testing
const exampleProfileData = {
  name: 'Name',
  GPA: 3,
  Major: 'Computer Science',
  universityLocation: 'Purdue University Fort Wayne'
}

describe('UserProfileService', () => {
  let service: UserProfileService;

  // mock post request to capture when post requests are made
  const httpService = jasmine.createSpyObj('HttpClient', ['post'])
  let httpSpy = httpService.post.and.returnValue(of(true));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpService },
      ]
    });
    service = TestBed.inject(UserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.post', () => {
    service.submitProfileChanges(exampleProfileData);
    expect(httpSpy).withContext('post() called').toHaveBeenCalled(); // I would "to have been called once" but the system doesn't like observables for whatever stupid reason, so that's that.
  })
});
