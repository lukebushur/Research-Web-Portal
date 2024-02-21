import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToPostComponent } from './apply-to-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ProjectData } from 'src/app/_models/apply-to-post/projectData';
import { of } from 'rxjs';
import { ApplyToPostService } from 'src/app/controllers/apply-to-post/apply-to-post.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('ApplyToPostComponent', () => {
  let component: ApplyToPostComponent;
  let fixture: ComponentFixture<ApplyToPostComponent>;
  let getProjectInfoSpy: jasmine.Spy;
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
    questions: [{
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
    }],
  };
  const getProjectInfoResponse = {
    success: {
      project: {
        ...testProjectData
      }
    }
  };
  let createApplicationSpy: jasmine.Spy;
  const createApplicationResponse = {
    success: {
      status: 200,
      message: 'APPLICATION_CREATED',
    }
  };
  let navigateSpy: jasmine.Spy;
  
  beforeEach(() => {

    const applyService = jasmine.createSpyObj('ApplyToPostService', [
      'getProjectInfo',
      'createApplication',
    ]);
    getProjectInfoSpy = applyService.getProjectInfo.and.returnValue(of(getProjectInfoResponse));
    createApplicationSpy = applyService.createApplication.and.returnValue(of(createApplicationResponse));

    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate;

    TestBed.configureTestingModule({
      declarations: [ApplyToPostComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatListModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ApplyToPostService, useValue: applyService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                profName: 'Test Professor',
                profEmail: 'testemail@email.com',
                oppId: '123',
              }),
            }
          }
        },
      ],
    });
    fixture = TestBed.createComponent(ApplyToPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize project data', () => {
    expect(component).toBeTruthy();
    expect(component.project).toEqual(testProjectData);
    expect(component.formQuestions.value).toEqual([
      // Question 1 Answers
      {
        item1: false,
        item2: false,
        item3: false,
      },
      // Question 2 Answers
      '',
      // Question 3 Answers
      '',
    ]);
  });

  it('getCheckBoxControl() should function correctly', () => {
    expect(component.getCheckBoxControl(0, 'item1')!.value).toBeFalse();
    expect(component.getCheckBoxControl(1, 'item1')).toBeNull();
    expect(component.getCheckBoxControl(0, 'none')).toBeUndefined();
  });

  it('categoriesString() should function correctly', () => {
    expect(component.categoriesString()).toEqual('Technology, Documentation, Writing');
  });

  it('majorsString() should function correctly', () => {
    expect(component.majorsString()).toEqual('Computer Science, Theatre');
  });

  it('formatGPA() should function correctly', () => {
    expect(component.formatGPA()).toEqual('2.00');
  });

  it('dateToString() should function correctly', () => {
    expect(component.dateToString(undefined)).toEqual('None');
    const dateStr = component.project.deadline;
    expect(component.dateToString(dateStr)).toEqual('Mar 17, 2024');
  });

  it('submitApp() should function correctly', () => {
    component.formQuestions.at(0).get('item1')!.setValue(true);
    component.formQuestions.at(0).get('item3')!.setValue(true);
    console.log(component.formQuestions.at(0).value);
    
    expect(component.formatGPA()).toEqual('2.00');
  });
});
