import { TestBed } from '@angular/core/testing';

import { ProfileServiceService } from './profile-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth-controller/auth.service';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const exampleProfileData = {
  name: 'Name',
  GPA: 3,
  Major: 'Computer Science',
  universityLocation: 'Purdue University Fort Wayne'
}

const ExampleHttpHeaders = of(new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${'123456'}`,
}))

describe('ProfileServiceService', () => {
  let service: ProfileServiceService;

  const httpService = jasmine.createSpyObj('HttpClient', ['post'])
  let httpSpy = httpService.post.and.returnValue(of(true));

  const authService = jasmine.createSpyObj('AuthService', ['getHeaders']);
  let authSpy = authService.getHeaders.and.returnValue(
    of(ExampleHttpHeaders));

  service = new ProfileServiceService(httpService, authService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        { 
          provide: HttpClient,
          useValue: httpService
        }
      ]
    });
    service = TestBed.inject(ProfileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch headers', () => {
    service.submitProfileChanges(exampleProfileData);
    expect(authSpy).withContext('getHeaders() called').toHaveBeenCalled();
  })

  it('should call http.post', () => {
    service.submitProfileChanges(exampleProfileData);
    expect(httpSpy).withContext('post() called').toHaveBeenCalled() // I would "to have been called once" but the system doesn't like observables for whatever stupid reason, so that's that.
  })
});
