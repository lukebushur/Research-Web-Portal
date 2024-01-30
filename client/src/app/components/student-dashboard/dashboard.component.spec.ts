import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StudentDashboard } from './dashboard.component';

describe('StudentDashboard', () => {
  let component: StudentDashboard;
  let fixture: ComponentFixture<StudentDashboard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDashboard],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(StudentDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
