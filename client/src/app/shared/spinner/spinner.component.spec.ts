import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';
import { LoaderService } from 'app/controllers/load-controller/loader.service';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  let returnValue = true;

  const loaderService = jasmine.createSpyObj('LoaderService', ['getLoading'])
  let loaderSpy = loaderService.getLoading.and.callFake(function () {
    return returnValue;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [
        {
          provide: LoaderService,
          useValue: loaderService
        }
      ]
    });
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLoading()', () => {
    returnValue = true;
    expect(loaderSpy).toHaveBeenCalled();
  })

});
