import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewProjectComponent } from './student-view-project.component';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { QuestionData } from 'app/shared/models/questionData';
import { StudentService } from '../student-service/student.service';
import { of } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { StudentProjectInfo } from '../models/student-project-info';
import { Component, input } from '@angular/core';
import { ProjectInfoCardComponent } from 'app/shared/project-info-card/project-info-card.component';
import { QuestionCardComponent } from 'app/shared/question-card/question-card.component';
import { MatAccordionHarness } from '@angular/material/expansion/testing';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-info-card',
  template: '<h1>Project Information Component</h1>'
})
class ProjectInfoCardStubComponent {
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
}

describe('StudentViewProjectComponent', () => {
  let component: StudentViewProjectComponent;
  let fixture: ComponentFixture<StudentViewProjectComponent>;
  let loader: HarnessLoader;

  // URL parameters
  const projectId = '123';
  const professorEmail = 'test@email.com';

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
  const projectData: StudentProjectInfo = {
    professorId: '123',
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
  let studentService: jasmine.SpyObj<StudentService>
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    // Create the spy object to mock the getProjectInfo method.
    studentService = jasmine.createSpyObj<StudentService>('StudentService', ['getProjectInfo']);
    // spied methods' return values are the fake data defined above
    studentService.getProjectInfo.and.returnValue(of(projectData));

    await TestBed.configureTestingModule({
      imports: [StudentViewProjectComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                projectId: projectId,
                professorEmail: professorEmail
              })
            }
          }
        },
      ]
    }).overrideComponent(StudentViewProjectComponent, {
      remove: {
        imports: [
          ProjectInfoCardComponent,
          QuestionCardComponent,
        ]
      },
      add: {
        imports: [
          ProjectInfoCardStubComponent,
          QuestionCardStubComponent,
        ]
      },
    }).compileComponents();

    fixture = TestBed.createComponent(StudentViewProjectComponent);
    // loader for Material component testing
    loader = TestbedHarnessEnvironment.loader(fixture);
    // inject router so that it can later be spied on
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(studentService.getProjectInfo).toHaveBeenCalledOnceWith(professorEmail, projectId);
    expect(component.projectData$.getValue()).toEqual(projectData);
  });

  it('apply button should navigate to the apply page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.apply();

    expect(navigateSpy).toHaveBeenCalledOnceWith(['/student/apply-to-project'], {
      queryParams: {
        profName: projectData.professorName,
        profEmail: professorEmail,
        oppId: projectId
      }
    });
  });

  it('back button should navigate back', () => {
    const backSpy = spyOn(location, 'back');
    component.back();

    expect(backSpy).toHaveBeenCalledOnceWith();
  });

  it('should create an accordion with two expansion panels', async () => {
    const accordion = await loader.getHarness(MatAccordionHarness);
    const panels = await accordion.getExpansionPanels()

    expect(panels.length).toEqual(2);
    expect(await panels[0].getTextContent()).toEqual('Project Information Component');
    expect(await panels[1].getTextContent()).toMatch(/(Question Card Component){3}/);
  });
});
