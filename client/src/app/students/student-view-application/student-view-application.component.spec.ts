import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentViewApplicationComponent } from './student-view-application.component';
import { StudentService } from '../student-service/student.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { QuestionData } from 'app/shared/models/questionData';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StudentProjectInfo } from '../models/student-project-info';
import { Component, input } from '@angular/core';
import { MatAccordionHarness } from '@angular/material/expansion/testing';
import { StudentProjectDescriptionComponent } from '../student-project-description/student-project-description.component';
import { QuestionCardComponent } from 'app/shared/question-card/question-card.component';

@Component({
  selector: 'app-student-project-description',
  template: '<h1>Project Information Component</h1>'
})
class StudentProjectDescriptionStubComponent {
  readonly professorEmail = input.required<string>();
  readonly project = input.required<StudentProjectInfo>();
}

@Component({
  selector: 'app-question-card',
  template: '<h1>Question Card Component</h1>'
})
class QuestionCardStubComponent {
  readonly questionNum = input.required<number>();
  readonly questionData = input.required<QuestionData>();
  readonly showAnswer = input<boolean>(false);
}

describe('StudentViewApplicationComponent', () => {
  let component: StudentViewApplicationComponent;
  let fixture: ComponentFixture<StudentViewApplicationComponent>;
  let loader: HarnessLoader;
  const applicationId = '122';
  const questionsData: QuestionData[] = [
    {
      question: 'Choose One',
      required: true,
      requirementType: 'radio button',
      choices: [
        'option 1',
        'option 2',
      ],
      answers: [
        'option 1',
      ],
    },
    {
      question: 'Describe',
      required: true,
      requirementType: 'text',
      answers: [
        'many details',
      ],
    },
    {
      question: 'Choose multiple',
      required: true,
      requirementType: 'check box',
      choices: [
        'choice 1',
        'choice 2',
        'choice 3',
      ],
      answers: [
        'choice 1',
        'choice 3',
      ],
    },
  ];
  const questionsNoAnswersData: QuestionData[] = questionsData.map((question) => {
    const { answers: _, ...questionNoAnswer } = question;
    return questionNoAnswer;
  });
  const applicationData = {
    _id: '123',
    professorEmail: 'prof@email.com',
    questions: questionsData,
    status: 'Pending',
    appliedDate: '2024-03-23T16:07:24.598Z',
    lastModified: '2024-03-23T16:07:24.598Z',
    lastUpdated: '2024-03-23T16:07:24.598Z',
    opportunityId: '124',
    opportunityRecordId: '125',
  };
  const projectData: StudentProjectInfo = {
    projectName: 'Test Project Name',
    professorName: 'First Last',
    professorId: '126',
    questions: questionsNoAnswersData,
    description: 'Test project description.',
    responsibilities: 'Test project responsibilities.',
    categories: [
      'Virtual Reality',
      'Data Analytics',
      'Manufacturing',
    ],
    GPA: 1.0,
    majors: [
      'Computer Science',
      'Mathematics',
      'Biology',
    ],
    posted: new Date('Mon Feb 19 2024'),
    deadline: new Date('Thu Jul 18 2024'),
  }
  let studentService: jasmine.SpyObj<StudentService>;
  let router: Router;

  beforeEach(() => {
    studentService = jasmine.createSpyObj<StudentService>('StudentService', [
      'getApplication',
      'getProjectInfo',
      'deleteApplication'
    ]);
    studentService.getApplication.and.returnValue(of({
      success: {
        application: applicationData
      }
    }));
    studentService.getProjectInfo.and.returnValue(of(projectData));
    studentService.deleteApplication.and.returnValue(of({
      success: {
        status: 200,
        message: 'APPLICATION_DELETED',
      }
    }));

    TestBed.configureTestingModule({
      imports: [
        StudentViewApplicationComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentService },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: new Map([
                ['applicationID', applicationId],
              ]),
            }
          }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    }).overrideComponent(StudentViewApplicationComponent, {
      remove: {
        imports: [
          StudentProjectDescriptionComponent,
          QuestionCardComponent,
        ]
      },
      add: {
        imports: [
          StudentProjectDescriptionStubComponent,
          QuestionCardStubComponent,
        ]
      },
    });
    fixture = TestBed.createComponent(StudentViewApplicationComponent);
    router = TestBed.inject(Router);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.projectInfo$.value).toEqual(projectData);
    expect(studentService.getProjectInfo).toHaveBeenCalledOnceWith(applicationData.professorEmail, applicationData.opportunityId);
    expect(component.applicationData$.value).toEqual(applicationData);
    expect(studentService.getApplication).toHaveBeenCalledOnceWith(applicationId);
    expect(component.applicationData$.value.questions).toEqual(questionsData);
  });

  it('should render project information component expansion panel', async () => {
    const expansionPanels = await loader.getAllHarnesses(MatAccordionHarness);
    expect(expansionPanels.length).toEqual(1);

    const expansionPanel = expansionPanels[0];
    const projectInfo = (await expansionPanel.getExpansionPanels())[0];
    expect(await projectInfo.getTitle()).toEqual('Project Information');
    expect(await projectInfo.getTextContent()).toEqual('Project Information Component');
  });

  it('should render application status expansion panel', async () => {
    const expansionPanels = await loader.getAllHarnesses(MatAccordionHarness);
    expect(expansionPanels.length).toEqual(1);

    const expansionPanel = expansionPanels[0];
    const applicationStatus = (await expansionPanel.getExpansionPanels())[1];
    expect(await applicationStatus.getTitle()).toEqual('Application Status');

    const textContent = await applicationStatus.getTextContent();
    expect(textContent).toContain('Application Status');
    expect(textContent).toContain('Pending');
    expect(textContent).toContain('Applied On');
  });

  it('should render application answers expansion panel', async () => {
    const expansionPanels = await loader.getAllHarnesses(MatAccordionHarness);
    expect(expansionPanels.length).toEqual(1);

    const expansionPanel = expansionPanels[0];
    const projectInfo = (await expansionPanel.getExpansionPanels())[2];
    expect(await projectInfo.getTitle()).toEqual('Application Answers');
    expect(await projectInfo.getTextContent()).toMatch(/(Question Card Component){3}/);
  });

  it('should display a button for application modification', async () => {
    const modifyButton = await loader.getHarness(MatButtonHarness.with({ text: 'Modify Application' }));
    expect(modifyButton).toBeTruthy();
    //TODO: Test this functionality once it is implemented
  });

  it('should display a button for rescinding an application', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    const rescindButton = await loader.getHarness(MatButtonHarness.with({ text: 'Rescind Application' }));
    expect(rescindButton).toBeTruthy();
    await rescindButton.click();
    expect(studentService.deleteApplication).toHaveBeenCalledOnceWith(applicationData._id);
    expect(navigateSpy).toHaveBeenCalledWith(['/student/applications-overview']);
  });
});
