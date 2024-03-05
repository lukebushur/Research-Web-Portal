import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentViewApplicationComponent } from '../student-view-application/student-view-application.component';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { SearchProjectService } from 'src/app/controllers/search-project-controller/search-project.service';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent {}


describe('StudentViewApplicationComponent', () => {
  let component: StudentViewApplicationComponent;
  let fixture: ComponentFixture<StudentViewApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentViewApplicationComponent],

      imports: [HttpClientTestingModule, RouterModule.forRoot([]), SpinnerSubComponent, CommonModule], // Add CommonModule here
      providers: [
        StudentDashboardService, // Provide StudentDashboardService here
        {
          provide: DateConverterService,
          useValue: {}
        },
        {
          provide: SearchProjectService,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentViewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
  });
});
