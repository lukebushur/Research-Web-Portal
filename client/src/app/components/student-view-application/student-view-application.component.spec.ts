import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentViewApplicationComponent } from './student-view-application.component';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';
import { ProjectData } from 'src/app/_models/apply-to-post/projectData';
import { Component } from '@angular/core';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { };

import { provideRouter } from '@angular/router';

describe('StudentViewApplicationComponent', () => {
  let component: StudentViewApplicationComponent;
  let fixture: ComponentFixture<StudentViewApplicationComponent>;
  let studentServiceSpy: jasmine.SpyObj<StudentDashboardService>;
  let dateConverterServiceSpy: jasmine.SpyObj<DateConverterService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const mockActivatedRoute = {
    params: of({ applicationID: 'mock-application-id' })
  };

  // Mock question data
  const testQuestionData: QuestionData[] = [
    {
      question: 'Choose any of the following.',
      requirementType: 'check box',
      required: true,
      choices: ['item1', 'item2', 'item3'],
    },
    {
      question: 'Which one is correct?',
      requirementType: 'radio button',
      required: true,
      choices: ['option1', 'option2', 'option3'],
    },
    {
      question: 'Please describe your details.',
      requirementType: 'text',
      required: true,
    },
  ];
  // Mock project data
  const testProjectData: ProjectData = {
    professorName: 'Test Professor',
    professorEmail: 'testemail@email.com',
    projectID: '123',
    projectName: 'Test Project',
    description: 'This project is for testing.',
    categories: ['Technology', 'Documentation', 'Writing'],
    GPA: 2.00,
    majors: ['Computer Science', 'Theatre'],
    posted: 'Fri Feb 16 2024',
    deadline: 'Sun Mar 17 2024',
    questions: testQuestionData,
  };

  beforeEach(waitForAsync(() => {
    const studentServiceSpyObj = jasmine.createSpyObj('StudentDashboardService', ['getApplication', 'getProjectInfo', 'deleteApplication']);
    const dateConverterServiceSpyObj = jasmine.createSpyObj('DateConverterService', ['convertShortDate']);

    TestBed.configureTestingModule({
      declarations: [StudentViewApplicationComponent],
      
      imports: [
        SpinnerSubComponent,
        HttpClientTestingModule,
        StudentViewApplicationComponent,
        MatCardModule,
        SpinnerSubComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StudentDashboardService, useValue: studentServiceSpyObj },
        { provide: DateConverterService, useValue: dateConverterServiceSpyObj },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        provide StudentDashboardService,
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

    studentServiceSpy = TestBed.inject(StudentDashboardService) as jasmine.SpyObj<StudentDashboardService>;
    dateConverterServiceSpy = TestBed.inject(DateConverterService) as jasmine.SpyObj<DateConverterService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(StudentViewApplicationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    // it('should fetch application data on init', () => {
    //   const mockProjectInfo = { success: { project: { testProjectData } } };

    //   studentServiceSpy.getProjectInfo.and.returnValue(of(mockProjectInfo));
    //   dateConverterServiceSpy.convertShortDate.and.returnValue('mock-date');
    //   component.ngOnInit();

    //   expect(studentServiceSpy.getProjectInfo).toHaveBeenCalled();
    //   expect(dateConverterServiceSpy.convertShortDate).toHaveBeenCalled();
    // });

    it('should handle error fetching application data', () => {
      studentServiceSpy.getApplication.and.returnValue(throwError('Error fetching application'));
      component.ngOnInit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/student/applications-overview'], Object({  }));
    });
  });

  // describe('getChoice', () => {
  //   it('should return true if answer matches choice', () => {
  //     const answer = { answers: ['choice1'] };
  //     const index = 0;
  //     const result = component.getChoice(answer, index);
  //     expect(result).toBeTruthy();
  //   });

  //   it('should return false if answer does not match choice', () => {
  //     const answer = { answers: ['other-choice'] };
  //     const index = 0;
  //     const result = component.getChoice(answer, index);
  //     expect(result).toBeFalsy();
  //   });
  // });

  // describe('rescindApplication', () => {
  //   it('should navigate to applications overview after rescinding application', () => {
  //     const mockApplicationData = {
  //       success: {
  //         application: { /* Your mock application data */ }
  //       }
  //     };    
  //     // Set up spy to return mock application data
  //     studentServiceSpy.getApplication.and.returnValue(of(mockApplicationData));    
  //     // Trigger ngOnInit
  //     component.ngOnInit();    
  //     // Expect application data to be set
  //     expect(component.applicationData).toEqual(mockApplicationData.success.application);    
  //     // Call rescindApplication
  //     component.rescindApplication('applicationID');    
  //     // Expect Router.navigate to be called with the correct argument
  //     expect(routerSpy.navigate).toHaveBeenCalledWith(['/student/applications-overview']);
  //   });

  //   it('should log error if rescinding application fails', () => {
  //     studentServiceSpy.deleteApplication.and.returnValue(throwError('Error rescinding application'));
  //     spyOn(console, 'log');
  //     component.rescindApplication('mock-application-id');
  //     expect(console.log).toHaveBeenCalledWith('Error', jasmine.any(String));
  //   });
  // });
});
