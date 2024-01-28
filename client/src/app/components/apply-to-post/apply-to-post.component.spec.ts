import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToPostComponent } from './apply-to-post.component';

describe('AppComponent', () => {
  let component: ApplyToPostComponent;
  let fixture: ComponentFixture<ApplyToPostComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApplyToPostComponent],
    });
    fixture = TestBed.createComponent(ApplyToPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the "applyToOpp" title', () => {
    expect(component.title).toEqual('applyToOpp');
  });
});
