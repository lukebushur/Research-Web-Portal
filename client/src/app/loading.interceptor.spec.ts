import { TestBed, fakeAsync } from '@angular/core/testing';

import { LoadingInterceptor } from './loading.interceptor';
import { Observable } from 'rxjs';
import { LoaderService } from './controllers/load-controller/loader.service';
import { HttpRequest } from '@angular/common/http';

describe('LoadingInterceptor', () => {
  let setLoadingSpy: jasmine.Spy;
  // mock next variable for passing to the LoadingInterceptor
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

  beforeEach(() => {
    // mock setLoading function for LoaderService so that it just does nothing
    const loaderService = jasmine.createSpyObj<LoaderService>('LoaderService', ['setLoading']);
    setLoadingSpy = loaderService.setLoading.and.returnValue();

    TestBed.configureTestingModule({
      providers: [
        LoadingInterceptor,
        {
          provide: LoaderService,
          useValue: loaderService
        }
      ]
    })
  });

  // Make a mock HTTP request to send through, waits for that, then checks if it was called with true
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
