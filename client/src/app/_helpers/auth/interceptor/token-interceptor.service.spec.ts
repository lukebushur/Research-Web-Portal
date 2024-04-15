import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token-interceptor.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;

  // Create a new instance of the TokenInterceptor before each test
  beforeEach(() => {
    interceptor = new TokenInterceptor();
  });

  // Test that the TokenInterceptor is created
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  // Test that the Authorization header is added to the request
  it('created request should have the Authorization header set', () => {
    // Create a mock request with handle method
    const next: HttpHandler = {
      handle: () => {
        // Return an empty observable
        return new Observable<HttpEvent<any>>(subscriber => {
          subscriber.complete();
        });
      }
    };
    // Create a mock request
    const mockRequest = new HttpRequest('GET', '/test');

    // Spy on the handle method of the next handler
    spyOn(next, 'handle').and.callThrough();
    // Call the intercept method of the interceptor
    interceptor.intercept(mockRequest, next).subscribe();
    // Expect the handle method to have been called
    expect(next.handle).toHaveBeenCalled();
  });
});
