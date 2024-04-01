import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { StudentDashboard } from './dashboard.component';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { Router } from '@angular/router';
import { ProjectData } from 'src/app/_models/apply-to-post/projectData';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

describe('StudentDashboard', () => {
  let component: StudentDashboard;
  let fixture: ComponentFixture<StudentDashboard>;
  let testGetProjectsResponse: Object;
  let getProjectsSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let getStudentInfoSpy: jasmine.Spy;

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
    GPA: 2.0,
    majors: ['Computer Science', 'Theatre'],
    posted: 'Fri Feb 16 2024',
    deadline: 'Sun Mar 17 2024',
    questions: testQuestionData,
  };
  const getProjectInfoResponse = {
    success: {
      status: 200,
      message: "PROJECTS_FOUND",
      data: [
        testProjectData
      ]
    }
  };
  const getStudentInfoResponse = {
    success: {
      status: 200,
      message: "ACCOUNT_FOUND",
      accountData: {
        email: "test@email.com",
        name: "Test Test",
        universityLocation: "Purdue University Fort Wayne",
        emailConfirmed: true,
        GPA: 3.0,
        Major: [
          "Major 1",
          "Major 2"
        ]
      }
    }
  }

  beforeEach(() => {

    const studentDashboardService = jasmine.createSpyObj('StudentDashboardService', ['getOpportunities', 'getStudentInfo']);
    getProjectsSpy = studentDashboardService.getOpportunities.and.returnValue(of(getProjectInfoResponse));
    getStudentInfoSpy = studentDashboardService.getStudentInfo.and.returnValue(of(getStudentInfoResponse));

    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CdkAccordionModule,
        SpinnerSubComponent,
        MatTableModule,
        MatCardModule,
        MatDividerModule,
        MatTooltipModule,
        StudentDashboard
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: StudentDashboardService, useValue: studentDashboardService }
      ]
    });
    fixture = TestBed.createComponent(StudentDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a project card component', () => {
    const dashboardElement: HTMLElement = fixture.nativeElement;
    const jobCard = dashboardElement.querySelector('.opp-card')!;
    expect(jobCard).toBeTruthy();
  });

  it('should navigate you to your applications', () => {
    const buttonDebugElement = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'See all applications'
    )
    buttonDebugElement.triggerEventHandler('click', null)
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/applications-overview']);
  })

  it('should navigate you to search projects', () => {
    const buttonDebugElement = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Search opportunities'
    )
    buttonDebugElement.triggerEventHandler('click', null)
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/search-projects']);
  })

  it('should navigate you to view project', () => {
    const buttonDebugElement = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'VIEW'
    )
    buttonDebugElement.triggerEventHandler('click', null)
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith([`/student/view-project/${btoa(testProjectData.professorEmail)}/${testProjectData.projectID}`]);
  })

  it('should navigate you to apply-to-project', () => {
    const buttonDebugElement = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent === 'APPLY'
    )
    buttonDebugElement.triggerEventHandler('click', null)
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/apply-to-project'], {
      queryParams: {
        profName: testProjectData.professorName,
        profEmail: testProjectData.professorEmail,
        oppId: testProjectData.projectID,
      }
    });
  })

});