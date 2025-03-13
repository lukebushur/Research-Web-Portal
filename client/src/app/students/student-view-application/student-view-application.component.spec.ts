import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentViewApplicationComponent } from './student-view-application.component';
import { StudentService } from '../student-service/student.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { QuestionData } from 'app/shared/models/questionData';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

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
  const projectData = {
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
    posted: 'Mon Feb 19 2024',
    deadline: 'Thu Jul 18 2024',
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
    studentService.getProjectInfo.and.returnValue(of({
      success: {
        project: projectData
      }
    }));
    studentService.deleteApplication.and.returnValue(of({
      success: {
        status: 200,
        message: 'APPLICATION_DELETED',
      }
    }));

    TestBed.configureTestingModule({
      imports: [
        SpinnerSubComponent,
        StudentViewApplicationComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentService },
        {
          provide: ActivatedRoute, useValue: {
            params: of({
              applicationID: applicationId,
            })
          }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(StudentViewApplicationComponent);
    router = TestBed.inject(Router);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.projectInfo).toEqual(projectData);
    expect(studentService.getProjectInfo).toHaveBeenCalledOnceWith(applicationData.professorEmail, applicationData.opportunityId);
    expect(component.applicationData).toEqual(applicationData);
    expect(studentService.getApplication).toHaveBeenCalledOnceWith(applicationId);
    expect(component.questions).toEqual(questionsData);
  });

  it('should render project details 1st card', async () => {
    const cards = await loader.getAllHarnesses(MatCardHarness);
    const projectText = await cards[0].getText();

    expect(projectText).toContain('Professor Name: ' + projectData.professorName);
    expect(projectText).toContain('Created: ' + (new Date(projectData.posted)).toLocaleDateString());
    expect(projectText).toContain(projectData.description);
    expect(projectText).toContain('Applied: ' + (new Date(applicationData.appliedDate)).toLocaleDateString());
    expect(projectText).toContain(applicationData.status);
  });

  it('should render project responsibilities', async () => {
    const cards = await loader.getAllHarnesses(MatCardHarness);
    expect(await cards[1].getText()).toContain('Expected Responsibilities');

    const responsibilitiesCard = await cards[1].getHarness(MatCardHarness);
    expect(await responsibilitiesCard.getText()).toEqual(projectData.responsibilities);
  });

  it('should render project details 2nd card', async () => {
    const cards = await loader.getAllHarnesses(MatCardHarness);
    expect(await cards[1].getText()).toContain('Project Requirements & Information');

    const projectDetailsCard = (await cards[1].getAllHarnesses(MatCardHarness))[1];
    const projectText = await projectDetailsCard.getText();
    expect(projectText).toContain('GPA Requirement: ' + projectData.GPA);
    expect(projectText).toContain('Application Deadline: ' + (new Date(projectData.deadline).toLocaleDateString()));
    expect(projectText).toContain('Applicable Majors: ' + projectData.majors.join(', '));
    expect(projectText).toContain('Project Categories: ' + projectData.categories.join(', '));
  });

  it('should render project details 2nd card', async () => {
    const cards = await loader.getAllHarnesses(MatCardHarness);
    expect(await cards[1].getText()).toContain('Application Questions');

    const applicationCard = (await cards[1].getAllHarnesses(MatCardHarness))[2];
    const applicationText = await applicationCard.getText();

    expect(applicationText).toContain('Question 1: ' + questionsData[0].question);
    const q1RadioGroup = await applicationCard.getHarness(MatRadioGroupHarness);
    expect(await q1RadioGroup.getCheckedValue()).toEqual(questionsData[0].answers![0]);

    expect(applicationText).toContain('Question 2: ' + questionsData[1].question);
    const q2TextArea = await applicationCard.getHarness(MatInputHarness);
    expect(await q2TextArea.getValue()).toEqual(questionsData[1].answers![0]);

    expect(applicationText).toContain('Question 3: ' + questionsData[2].question);
    const q3CheckGroups = await applicationCard.getAllHarnesses(MatCheckboxHarness);
    for (let i = 0; i < q3CheckGroups.length; i++) {
      expect(await q3CheckGroups[i].getLabelText()).toEqual(questionsData[2].choices![i]);
      expect(await q3CheckGroups[i].isChecked()).toEqual(questionsData[2].answers!.includes(questionsData[2].choices![i]));
    }
  });

  it('should display a button for application modification', async () => {
    const modifyButton = await loader.getHarness(MatButtonHarness.with({ text: 'Modify Application' }));
    expect(modifyButton).toBeTruthy();
    await modifyButton.click();
    //TODO: Test this functionality once it is implemented
  });

  it('should display a button for rescinding and application', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    const rescindButton = await loader.getHarness(MatButtonHarness.with({ text: 'Rescind Application' }));
    expect(rescindButton).toBeTruthy();
    await rescindButton.click();
    expect(studentService.deleteApplication).toHaveBeenCalledOnceWith(applicationData._id);
    expect(navigateSpy).toHaveBeenCalledWith(['/student/applications-overview'], {});
  });
});
