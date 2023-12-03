import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchProjectCardComponent } from './research-project-card.component';

describe('ResearchProjectCardComponent', () => {
  let component: ResearchProjectCardComponent;
  let fixture: ComponentFixture<ResearchProjectCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchProjectCardComponent]
    });
    fixture = TestBed.createComponent(ResearchProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
