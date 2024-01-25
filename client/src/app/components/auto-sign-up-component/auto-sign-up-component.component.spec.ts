import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSignUpComponent } from './auto-sign-up-component.component';

describe('AutoSignUpComponentComponent', () => {
  let component: AutoSignUpComponent;
  let fixture: ComponentFixture<AutoSignUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoSignUpComponent]
    });
    fixture = TestBed.createComponent(AutoSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
