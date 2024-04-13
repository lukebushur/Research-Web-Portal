import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoadingInterceptor } from './loading.interceptor';
import { Observable, of } from 'rxjs';
import { LoaderService } from './controllers/load-controller/loader.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule, HttpHandler, HttpRequest } from '@angular/common/http';

function ObservableDelay<T>(val: T, delay: number, cb = () => {
}): Observable<any> {
  return new Observable(observer => {
    setTimeout(() => {
      observer.next(val);
      observer.complete();
      cb();
    }, delay);
  });
}



describe('LoadingInterceptor', () => {

  const loaderService = jasmine.createSpyObj('LoaderService', ['setLoading']);
  let loader = loaderService.setLoading.and.returnValue(of(true));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [
        LoadingInterceptor,
        {
          provide: LoaderService,
          useValue: loaderService
        }
      ]
    })
  });

  const next: any = {
    handle: () => {
      return {
        pipe: () => {
          return new Observable((sub) => {
            sub.complete()
          });
        }
      }
    }
  }

  // Make a mock HTTP request to send through, waits for that, then checks if it was called with true and false
  it('should start loading when a request comes in', fakeAsync(() => { 
    const requestMock = new HttpRequest('GET', '/test');
    const interceptor = TestBed.inject(LoadingInterceptor);

    interceptor.intercept(requestMock, next).subscribe(() => {
      expect(loader).withContext('be called with true').toHaveBeenCalledWith(true);
      tick()
      expect(loader).withContext('to finish loading now').toHaveBeenCalledWith(false);
    })
  }));
});
