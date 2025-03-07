import { TestBed } from '@angular/core/testing';

import { SignoutService } from './signout.service';

describe('SignoutService', () => {
  const KEY = 'jwt-auth-token';
  let service: SignoutService;

  const randomToken = '1234567890';

  beforeEach(() => {
    // set the authentication token in the browser before anything happens
    // (signifies that a user is signed in)
    localStorage.setItem(KEY, randomToken);
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign you out', () => {
    service.signout();
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
