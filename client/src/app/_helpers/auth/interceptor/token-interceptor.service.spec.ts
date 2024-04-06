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
    const requestMock = new HttpRequest('GET', '/test');

    spyOn(next, 'handle').and.callThrough();
    interceptor.intercept(requestMock, next).subscribe();
    expect(next.handle).toHaveBeenCalledWith(requestMock.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem("jwt-auth-token")}`
      }
    }));
  });
});
