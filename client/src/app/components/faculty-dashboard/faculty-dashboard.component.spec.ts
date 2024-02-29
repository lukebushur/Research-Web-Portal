import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FacultyDashboardComponent } from './faculty-dashboard.component';
import { Component } from '@angular/core';

@Component({ standalone: true, selector: 'app-research-project-card', template: '' })
class ResearchProjectCardStubComponent {}

@Component({ standalone: true, selector: 'app-applied-student-table', template: '' })
class AppliedStudentTableStubComponent {}

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent {}

describe('FacultyDashboardComponent', () => {
  let component: FacultyDashboardComponent;
  let fixture: ComponentFixture<FacultyDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacultyDashboardComponent],
      imports: [
        HttpClientTestingModule,
        ResearchProjectCardStubComponent,
        AppliedStudentTableStubComponent,
        SpinnerSubComponent,
      ],
    });
    fixture = TestBed.createComponent(FacultyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
