import { firstValueFrom } from 'rxjs';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should be created and initially not loading', (done: DoneFn) => {
    expect(service).toBeTruthy();

    service.getLoading().subscribe({
      next: (loading: boolean) => {
        expect(loading).toEqual(false);
        done();
      }
    });
  });

  it('incrementRequests should change loading value', async () => {
    const loading$ = service.getLoading();
    expect(await firstValueFrom(loading$)).toEqual(false);

    service.incrementRequests();
    expect(await firstValueFrom(loading$)).toEqual(true);
  });

  it('decrementRequests should change loading value back to false', async () => {
    const loading$ = service.getLoading();
    expect(await firstValueFrom(loading$)).toEqual(false);

    service.incrementRequests();
    expect(await firstValueFrom(loading$)).toEqual(true);

    service.decrementRequests();
    expect(await firstValueFrom(loading$)).toEqual(false);
  });
});
