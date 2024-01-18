import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedStudentTableComponent } from './applied-student-table.component';

describe('AppliedStudentTableComponent', () => {
  let component: AppliedStudentTableComponent;
  let fixture: ComponentFixture<AppliedStudentTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppliedStudentTableComponent]
    });
    fixture = TestBed.createComponent(AppliedStudentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
