import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ViewApplicationComponent } from './view-application.component';
import { provideRouter } from '@angular/router';

describe('ViewApplicationComponent', () => {
  let component: ViewApplicationComponent;
  let fixture: ComponentFixture<ViewApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ViewApplicationComponent,
      ],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(ViewApplicationComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
