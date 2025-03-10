import { TestBed } from '@angular/core/testing';

import { SignoutService } from './signout.service';
import { restoreTokens, saveTokens, Tokens } from 'app/helpers/testing/token-storage';

describe('SignoutService', () => {
  const KEY = 'jwt-auth-token';
  let tokens: Tokens;

  let service: SignoutService;

  const randomToken = '1234567890';

  beforeAll(() => {
    tokens = saveTokens();
  });

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

  afterAll(() => {
    restoreTokens(tokens);
  });
});
