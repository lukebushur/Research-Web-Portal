import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ViewApplicationComponent } from './view-application.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ViewApplicationComponent', () => {
  let component: ViewApplicationComponent;
  let fixture: ComponentFixture<ViewApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewApplicationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule,],
    });
    fixture = TestBed.createComponent(ViewApplicationComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
