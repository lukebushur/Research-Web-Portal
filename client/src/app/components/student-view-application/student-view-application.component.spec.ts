import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentViewApplicationComponent } from '../student-view-application/student-view-application.component';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { SearchProjectService } from 'src/app/controllers/search-project-controller/search-project.service';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

describe('StudentViewApplicationComponent', () => {
  let component: StudentViewApplicationComponent;
  let fixture: ComponentFixture<StudentViewApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SpinnerSubComponent,
        HttpClientTestingModule,
        StudentViewApplicationComponent,
      ],
      providers: [
        provideRouter([]),
        StudentDashboardService,
        {
          provide: DateConverterService,
          useValue: {}
        },
        {
          provide: SearchProjectService,
          useValue: {}
        }
      ]
    });
    fixture = TestBed.createComponent(StudentViewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
