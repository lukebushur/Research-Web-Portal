import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeApplicationStatusComponent } from './large-application-status.component';

describe('LargeApplicationStatusComponent', () => {
  let component: LargeApplicationStatusComponent;
  let fixture: ComponentFixture<LargeApplicationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeApplicationStatusComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LargeApplicationStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create with input "Accept"', () => {
    fixture.componentRef.setInput('status', 'Accept')
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with input "Reject"', () => {
    fixture.componentRef.setInput('status', 'Reject')
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with input "Pending"', () => {
    fixture.componentRef.setInput('status', 'Pending')
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
