import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';
import { LoadingService } from '../../core/loading-service/loading.service';
import { of } from 'rxjs';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [LoadingService]
    });
    loadingService = TestBed.inject(LoadingService);
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render spinner when getLoading observable is true', async () => {
    const getLoadingSpy = spyOn(loadingService, 'getLoading').and.returnValue(of(true));
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(getLoadingSpy).toHaveBeenCalledOnceWith();

    await fixture.whenStable();
    fixture.detectChanges();

    const spinnerElement: HTMLElement = fixture.nativeElement;

    const h1 = spinnerElement.querySelector('h1')!;
    expect(h1.textContent).toEqual('Loading...');
  });

  it('should not render spinner when getLoading observable is false', async () => {
    const getLoadingSpy = spyOn(loadingService, 'getLoading').and.returnValue(of(false));
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(getLoadingSpy).toHaveBeenCalledOnceWith();

    await fixture.whenStable();
    fixture.detectChanges();

    const spinnerElement: HTMLElement = fixture.nativeElement;
    expect(spinnerElement.children.length).toEqual(0);
  });
});
