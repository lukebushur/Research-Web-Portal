import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    service = new LoaderService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getLoading()).toBeFalse();
  });

  it('getLoading should be false', () => {
    expect(service.getLoading()).toBeFalse();
  });

  it('setLoading should change loading variable', () => {
    service.setLoading(true);
    expect(service.getLoading()).toBeTrue();
  });
});
