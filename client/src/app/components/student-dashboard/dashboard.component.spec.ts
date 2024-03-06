import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { StudentDashboard } from './dashboard.component';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent {}

describe('StudentDashboard', () => {
  let component: StudentDashboard;
  let fixture: ComponentFixture<StudentDashboard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDashboard],
      imports: [HttpClientTestingModule, CdkAccordionModule,
        SpinnerSubComponent, MatTableModule],
    });
    fixture = TestBed.createComponent(StudentDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
