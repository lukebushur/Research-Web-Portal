import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewApplicationComponent } from './student-view-application.component';

describe('StudentViewApplicationComponent', () => {
  let component: StudentViewApplicationComponent;
  let fixture: ComponentFixture<StudentViewApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentViewApplicationComponent]
    });
    fixture = TestBed.createComponent(StudentViewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
