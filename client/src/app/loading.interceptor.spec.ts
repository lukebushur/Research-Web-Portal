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
  let setLoadingSpy: jasmine.Spy;

  beforeEach(() => {
    const loaderService = jasmine.createSpyObj<LoaderService>('LoaderService', ['setLoading']);
    setLoadingSpy = loaderService.setLoading.and.returnValue();

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
    const mockRequest = new HttpRequest('GET', '/test');
    const interceptor = TestBed.inject(LoadingInterceptor);

    interceptor.intercept(mockRequest, next).subscribe({
      complete: () => {
        expect(setLoadingSpy).withContext('be called with true').toHaveBeenCalledWith(true);
      }
    });
  }));
});
