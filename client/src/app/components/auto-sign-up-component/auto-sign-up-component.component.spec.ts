import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSignUpComponentComponent } from './auto-sign-up-component.component';

describe('AutoSignUpComponentComponent', () => {
  let component: AutoSignUpComponentComponent;
  let fixture: ComponentFixture<AutoSignUpComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoSignUpComponentComponent]
    });
    fixture = TestBed.createComponent(AutoSignUpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
