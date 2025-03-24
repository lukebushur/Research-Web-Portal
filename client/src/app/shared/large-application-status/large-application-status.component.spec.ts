import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeApplicationStatusComponent } from './large-application-status.component';

describe('LargeApplicationStatusComponent', () => {
  let component: LargeApplicationStatusComponent;
  let fixture: ComponentFixture<LargeApplicationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeApplicationStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeApplicationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
