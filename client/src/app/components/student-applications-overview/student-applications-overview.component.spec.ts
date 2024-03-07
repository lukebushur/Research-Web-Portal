import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentApplicationsOverviewComponent } from './student-applications-overview.component';

describe('StudentApplicationsOverviewComponent', () => {
  let component: StudentApplicationsOverviewComponent;
  let fixture: ComponentFixture<StudentApplicationsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentApplicationsOverviewComponent]
    });
    fixture = TestBed.createComponent(StudentApplicationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
