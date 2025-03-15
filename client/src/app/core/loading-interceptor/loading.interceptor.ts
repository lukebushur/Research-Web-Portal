import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../../shared/loader-service/loader.service';
import { finalize } from 'rxjs/operators';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingService = inject(LoaderService);

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
