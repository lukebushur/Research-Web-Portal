import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../loading-service/loading.service';
import { finalize } from 'rxjs/operators';

// token to set if the HTTP request should not cause the loading spinner to
// activate
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

// interceptor that increments a number in the loading service for every
// request and then decrements the same number once the request completes
export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingService = inject(LoadingService);

  if (!request.context.get(SKIP_LOADING)) {
    loadingService.incrementRequests();
    return next(request).pipe(
      finalize(() => {
        loadingService.decrementRequests();
      })
    );
  } else {
    return next(request);
  }
}
