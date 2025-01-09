import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectComponent } from './view-project.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { QuestionData } from 'app/_models/projects/questionData';
import { FacultyProjectService } from 'app/controllers/faculty-project-controller/faculty-project.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

interface ProjectData {
  projectName: string;
  professorName: string;
  description: string;
  responsibilities: string;
  categories: string[];
  posted: Date;
  GPA: number;
  majors: string[];
  deadline: Date;
  questions: QuestionData[];
};

interface ApplicantData {
  application: string;
  appliedDate: Date;
  name: string;
  email: string;
  GPA: number;
  majors: string;
  location: string;
  questions: QuestionData[];
  lastModified: Date;
  status: 'Accept' | 'Reject' | 'Pending';
};

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

describe('ViewProjectComponent', () => {
  let component: ViewProjectComponent;
  let fixture: ComponentFixture<ViewProjectComponent>;
  let loader: HarnessLoader;

  // URL parameters
  const projectId = '123';
  const projectType = 'active';

  // question data associated with the fake project
  const questionData: QuestionData[] = [
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
  // fake project data produced from the HTTP request
  const httpProjectData = {
    projectName: 'Test Name',
    professorName: 'Test Prof',
    description: 'Test description',
    responsibilities: 'Test responsibilities',
    categories: ['cat 1', 'cat 2', 'cat 3'],
    posted: 'Sat Apr 06 2024',
    GPA: 3.5,
    majors: ['Computer Science', 'Biology', 'Informatics'],
    deadline: 'Wed Apr 24 2024',
    questions: questionData,
  };
  // fake project data from the HTTP request after being transformed to match
  // the ProjectData interface
  const projectData: ProjectData = {
    projectName: 'Test Name',
    professorName: 'Test Prof',
    description: 'Test description',
    responsibilities: 'Test responsibilities',
    categories: ['cat 1', 'cat 2', 'cat 3'],
    posted: new Date(httpProjectData.posted),
    GPA: 3.5,
    majors: ['Computer Science', 'Biology', 'Informatics'],
    deadline: new Date(httpProjectData.deadline),
    questions: questionData,
  };
  // fake applicants data for the project
  const applicationsData: ApplicantData[] = [
    {
      application: '0',
      appliedDate: new Date(),
      email: 'name1@email.com',
      GPA: 2.0,
      location: 'Purdue University Fort Wayne',
      majors: 'Computer Science, Music, Information Technology',
      name: 'Name 1',
      questions: questionData.map(question => {
        const questionWithAnswer = <QuestionData>{
          ...question,
          answers: []
        };
        // applicants' answers data contains the questions with the applicants'
        // answers
        if (question.requirementType === 'text') {
          questionWithAnswer.answers!.push('name1 answer');
        } else if (question.requirementType === 'radio button') {
          questionWithAnswer.answers!.push(question.choices![0]);
        } else {
          questionWithAnswer.answers!.push(question.choices![0]);
        }
        return questionWithAnswer;
      }),
      lastModified: new Date(),
      status: 'Pending'
    },
    {
      application: '1',
      appliedDate: new Date(2024, 2, 30),
      email: 'name2@email.com',
      GPA: 3.2,
      location: 'Purdue University Fort Wayne',
      majors: 'Computer Science',
      name: 'Name 2',
      questions: questionData.map(question => {
        const questionWithAnswer = <QuestionData>{
          ...question,
          answers: []
        };
        // applicants' answers data contains the questions with the applicants'
        // answers
        if (question.requirementType === 'text') {
          questionWithAnswer.answers!.push('name2 answer');
        } else if (question.requirementType === 'radio button') {
          questionWithAnswer.answers!.push(question.choices![1]);
        } else {
          questionWithAnswer.answers!.push(question.choices![1]);
        }
        return questionWithAnswer;
      }),
      lastModified: new Date(2024, 2, 30),
      status: 'Accept'
    },
    {
      application: '2',
      appliedDate: new Date(2024, 1, 14),
      email: 'name3@email.com',
      GPA: 4.0,
      location: 'Purdue University Fort Wayne',
      majors: 'Computer Science, Mathematics',
      name: 'Name 3',
      questions: questionData.map(question => {
        const questionWithAnswer = <QuestionData>{
          ...question,
          answers: []
        };
        // applicants' answers data contains the questions with the applicants'
        // answers
        if (question.requirementType === 'text') {
          questionWithAnswer.answers!.push('name3 answer');
        } else if (question.requirementType === 'radio button') {
          questionWithAnswer.answers!.push(question.choices![2]);
        } else {
          questionWithAnswer.answers!.push(question.choices![0]);
          questionWithAnswer.answers!.push(question.choices![1]);
        }
        return questionWithAnswer;
      }),
      lastModified: new Date(2024, 1, 14),
      status: 'Reject'
    },
  ];
  let facultyService: jasmine.SpyObj<FacultyProjectService>;

  beforeEach(() => {
    // Create the spy object to mock the getProjectInfo nad
    // detailedFetchApplicants methods.
    facultyService = jasmine.createSpyObj<FacultyProjectService>('FacultyProjectService', [
      'getProject',
      'detailedFetchApplicants'
    ]);
    // spied methods' return values are the fake data defined above
    facultyService.getProject.and.returnValue(of({
      success: {
        project: httpProjectData
      }
    }));
    facultyService.detailedFetchApplicants.and.returnValue(of({
      success: {
        applicants: applicationsData.map(applicantion => {
          return {
            ...applicantion,
            majors: applicantion.majors.split(', '),
            appliedDate: applicantion.appliedDate.toISOString(),
            lastModified: applicantion.lastModified.toISOString(),
          }
        })
      }
    }));

    TestBed.configureTestingModule({
      imports: [
        SpinnerSubComponent,
        MatTableModule,
        ViewProjectComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideRouter([]),
        { provide: FacultyProjectService, useValue: facultyService },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                projectType: projectType,
                projectId: projectId,
              })
            }
          }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });
    fixture = TestBed.createComponent(ViewProjectComponent);
    // loader for Material component testing
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(facultyService.getProject).toHaveBeenCalledOnceWith(projectId, projectType);
    expect(component.projectData$.getValue()).toEqual(projectData);
    expect(component.questions).toEqual(questionData);
    expect(component.currentQuestionIndex).toEqual(0);
    expect(component.currentQuestionType).toEqual(questionData[0].requirementType);
    expect(component.currentQuestion).toEqual(questionData[0].question);
    expect(component.facultyAnswers).toEqual([[], '', '']);
    expect(facultyService.detailedFetchApplicants).toHaveBeenCalledOnceWith(projectId);
    expect(component.allApplicantsData).toEqual(applicationsData);
    expect(component.filteredApplicantsData).toEqual(applicationsData);
    expect(component.dataSource.data).toEqual(applicationsData);
  });

  it('displayRequirementType() return the correct results for each question type', () => {
    const reqTypes = [
      'text',
      'radio button',
      'check box'
    ];
    expect(component.displayRequirementType(reqTypes[0])).toEqual('Text Response');
    expect(component.displayRequirementType(reqTypes[1])).toEqual('Single Select');
    expect(component.displayRequirementType(reqTypes[2])).toEqual('Multiple Select');
  });

  // TODO: finish unit tests
});
