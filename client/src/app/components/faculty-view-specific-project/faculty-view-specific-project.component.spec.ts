import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyViewSpecificProjectComponent } from './faculty-view-specific-project.component';

describe('FacultyViewSpecificProjectComponent', () => {
  let component: FacultyViewSpecificProjectComponent;
  let fixture: ComponentFixture<FacultyViewSpecificProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacultyViewSpecificProjectComponent]
    });
    fixture = TestBed.createComponent(FacultyViewSpecificProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
