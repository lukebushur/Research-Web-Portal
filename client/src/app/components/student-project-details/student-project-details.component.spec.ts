import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProjectDetailsComponent } from './student-project-details.component';

describe('StudentProjectDetailsComponent', () => {
  let component: StudentProjectDetailsComponent;
  let fixture: ComponentFixture<StudentProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(StudentProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
