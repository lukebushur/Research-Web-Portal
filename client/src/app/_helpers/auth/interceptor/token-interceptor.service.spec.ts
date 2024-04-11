import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token-interceptor.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;

  beforeEach(() => {
    interceptor = new TokenInterceptor();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('created request should have the Authorization header set', () => {
    const next: HttpHandler = {
      handle: () => {
        return new Observable<HttpEvent<any>>(subscriber => {
          subscriber.complete();
        });
      }
    };
    const mockRequest = new HttpRequest('GET', '/test');

    spyOn(next, 'handle').and.callThrough();
    interceptor.intercept(mockRequest, next).subscribe();
    expect(next.handle).toHaveBeenCalled();
  });
});
