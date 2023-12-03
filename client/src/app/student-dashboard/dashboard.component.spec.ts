import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDashboard } from './dashboard.component';

describe('StudentDashboard', () => {
  let component: StudentDashboard;
  let fixture: ComponentFixture<StudentDashboard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDashboard]
    });
    fixture = TestBed.createComponent(StudentDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
