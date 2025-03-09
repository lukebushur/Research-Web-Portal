import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../controllers/load-controller/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  // keeps track of the total number of HTTP requests currently in progress
  private totalRequests = 0;

  constructor(
    private loadingService: LoaderService
  ) { }

  // Whenever an HTTP request is sent, increment totalRequests and tell the
  // loadingSrvice that data is still loading. After an HTTP request completes,
  // decrement totalRequests. If no more HTTP requests are in progress, tell
  // the loadingService that data retrieval is complete.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
