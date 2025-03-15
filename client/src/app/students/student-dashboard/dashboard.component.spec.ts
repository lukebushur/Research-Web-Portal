import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { StudentDashboard } from './dashboard.component';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { QuestionData } from 'app/shared/models/questionData';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentService } from '../student-service/student.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('StudentDashboard', () => {
  // Define variables for testing
  let component: StudentDashboard;
  let fixture: ComponentFixture<StudentDashboard>;
  let loader: HarnessLoader;

  let router: jasmine.SpyObj<Router>;
  let studentService: jasmine.SpyObj<StudentService>;

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
  const testProjectData: any = {
    professorName: 'Test Professor',
    professorEmail: 'testemail@email.com',
    _id: '123',
    projectName: 'Test Project',
    description: 'This project is for testing.',
    categories: ['Technology', 'Documentation', 'Writing'],
    GPA: 2.0,
    majors: ['Computer Science', 'Theatre'],
    posted: 'Fri Feb 16 2024',
    deadline: 'Sun Mar 17 2024',
    questions: testQuestionData,
  };
  // Mock responses
  const getProjectInfoResponse = {
    success: {
      status: 200,
      message: "PROJECTS_FOUND",
      data: [
        testProjectData
      ]
    }
  };
  // Mock search response
  const getSearchResponse = {
    success: {
      status: 200,
      message: "PROJECTS_FOUND",
      results: [
        testProjectData
      ]
    }
  };
  // Mock student info response
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
          "Computer Science",
          "Major 2"
        ]
      }
    }
  }

  // Set up the test bed
  beforeEach(() => {
    // Create a spy object for the router
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    // Create a spy object for the search project service
    studentService = jasmine.createSpyObj<StudentService>('StudentService', [
      'getOpportunities',
      'getStudentInfo',
      'searchProjectsMultipleParams',
    ]);
    studentService.searchProjectsMultipleParams.and.returnValue(of(getSearchResponse));
    studentService.getOpportunities.and.returnValue(of(getProjectInfoResponse));
    studentService.getStudentInfo.and.returnValue(of(getStudentInfoResponse));

    // Create the test bed
    TestBed.configureTestingModule({
      imports: [
        CdkAccordionModule,
        MatTableModule,
        MatCardModule,
        MatDividerModule,
        MatTooltipModule,
        StudentDashboard,
      ],
      providers: [
        // Provide the router
        // Provide the student service
        { provide: Router, useValue: router },
        { provide: StudentService, useValue: studentService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });
    // Create the component
    fixture = TestBed.createComponent(StudentDashboard);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Make sure it generates a new card for each project
  it('should create a project card component', () => {
    const dashboardElement: HTMLElement = fixture.nativeElement;
    const jobCard = dashboardElement.querySelector('.opp-card')!;
    expect(jobCard).toBeTruthy();
  });

  // Make sure it redirects you properly
  it('should navigate you to your applications', async () => {
    // Find the button we want
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'See all applications' }));
    await button.click();

    // Make sure it navigates you to the right place
    expect(router.navigate).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/applications-overview']);
  });

  it('should navigate you to search projects', async () => {
    // Find the button we want
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Search projects' }));
    await button.click();

    // Make sure it navigates you to the right place
    expect(router.navigate).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/search-projects']);
  });

  it('should navigate you to view project', async () => {
    // Find the button we want
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'VIEW' }));
    await button.click();

    // Make sure it navigates you to the right place
    expect(router.navigate).withContext('navigate called').toHaveBeenCalledOnceWith([`/student/view-project/${testProjectData.professorEmail}/${testProjectData._id}`]);
  });

  it('should navigate you to apply-to-project', async () => {
    // Find the button we want
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'APPLY' }));
    await button.click();

    // Make sure it navigates you to the right place
    expect(router.navigate).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/apply-to-project'], {
      queryParams: {
        // Pass the opportunity information to the apply-to-project page
        profName: testProjectData.professorName,
        profEmail: testProjectData.professorEmail,
        oppId: testProjectData._id,
      }
    });
  });

});
