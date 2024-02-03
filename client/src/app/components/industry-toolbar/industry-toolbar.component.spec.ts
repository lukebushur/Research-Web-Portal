import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryToolbarComponent } from './industry-toolbar.component';

describe('IndustryToolbarComponent', () => {
  let component: IndustryToolbarComponent;
  let fixture: ComponentFixture<IndustryToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustryToolbarComponent]
    });
    fixture = TestBed.createComponent(IndustryToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
