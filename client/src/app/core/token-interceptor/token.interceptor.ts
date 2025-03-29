import { HttpInterceptorFn } from '@angular/common/http';

// This is called before an HTTP request is sent.
// It automatically adds the Authorization header to the request.
export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  // Get the JWT token from the local storage.
  const authToken = localStorage.getItem("jwt-auth-token");

  // If the token is present, clone the request and add it to the headers.
  const clonedRequest = authToken
    ? request.clone({
      headers: request.headers.append('Authorization', `Bearer ${authToken}`)
    })
    : request;

  // Pass the request on to the next handler
  return next(clonedRequest);
}
