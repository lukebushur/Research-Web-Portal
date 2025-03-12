import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewProjectComponent } from './student-view-project.component';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { QuestionData } from 'app/_models/projects/questionData';
import { StudentService } from '../student-service/student.service';
import { of } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

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
  let studentService: jasmine.SpyObj<StudentService>
  let router: Router;

  beforeEach(async () => {
    // Create the spy object to mock the getProjectInfo method.
    studentService = jasmine.createSpyObj<StudentService>('StudentService', ['getProjectInfo']);
    // spied methods' return values are the fake data defined above
    studentService.getProjectInfo.and.returnValue(of({
      success: {
        project: httpProjectData
      }
    }));

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
    }).compileComponents();

    fixture = TestBed.createComponent(StudentViewProjectComponent);
    // loader for Material component testing
    loader = TestbedHarnessEnvironment.loader(fixture);
    // inject router so that it can later be spied on
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(studentService.getProjectInfo).toHaveBeenCalledOnceWith(professorEmail, projectId);
    expect(component.projectData$.getValue()).toEqual(projectData);
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

  it('Apply buttons should navigate to the apply page', () => {
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

  // TODO: Figure out how to test the DOM when the content depends on AsyncPipe
});
