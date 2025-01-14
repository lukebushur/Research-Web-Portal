import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  // This is called before an HTTP request is sent
  // It automatically adds the Authorization header to the request
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the JWT token from the local storage
    const authToken = localStorage.getItem("jwt-auth-token");

    // If the token is present, add it to the request
    if (authToken) {
      // Clone the request and add the new header
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        },
      });
    }
    // Pass the request on to the next handler
    return next.handle(req);
  }
}
