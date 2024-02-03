import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToPostComponent } from './apply-to-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ApplyToPostComponent', () => {
  let component: ApplyToPostComponent;
  let fixture: ComponentFixture<ApplyToPostComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApplyToPostComponent,
        BrowserAnimationsModule,
      ],
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
