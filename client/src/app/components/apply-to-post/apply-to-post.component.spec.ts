import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToPostComponent } from './apply-to-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ProjectData } from 'src/app/_models/apply-to-post/projectData';
import { of } from 'rxjs';
import { ApplyToPostService } from 'src/app/controllers/apply-to-post/apply-to-post.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';

describe('ApplyToPostComponent', () => {
  let component: ApplyToPostComponent;
  let fixture: ComponentFixture<ApplyToPostComponent>;
  let getProjectInfoSpy: jasmine.Spy;
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
    getProjectInfoSpy = applyService.getProjectInfo.and.returnValue(of(structuredClone(getProjectInfoResponse)));
    createApplicationSpy = applyService.createApplication.and.returnValue(of(createApplicationResponse));

    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      declarations: [ApplyToPostComponent],
      imports: [
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
                profName: testProjectData.professorName,
                profEmail: testProjectData.professorEmail,
                oppId: testProjectData.projectID,
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
    expect(component.project).toEqual({
      ...testProjectData,
      questions: testQuestionData.map((question, i) => {
        return {
          ...question,
          questionNum: i + 1,
        };
      }),
    });
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
    expect(getProjectInfoSpy).withContext('getProjectInfo() called').toHaveBeenCalledOnceWith({
      professorEmail: testProjectData.professorEmail,
      projectID: testProjectData.projectID,
    });
  });

  it('getCheckBoxControl() should function correctly', () => {
    expect(component.getCheckBoxControl(0, 'item1')!.value).toBeFalse();
    expect(component.getCheckBoxControl(1, 'item1')).toBeNull();
    expect(component.getCheckBoxControl(0, 'none')).toBeUndefined();
  });

  it('requireCheckboxesToBeChecked() should function correctly', () => {

    const checkboxGroup = new FormGroup({
      'one': new FormControl(false),
      'two': new FormControl(false),
      'three': new FormControl(false),
    });
    const checkboxValidator = component.requireCheckboxesToBeChecked(1);
    let checkboxValidatorResult = checkboxValidator(checkboxGroup); 
    expect(checkboxValidatorResult).toEqual({ requireCheckboxesToBeChecked: true });
    checkboxGroup.get('two')?.setValue(true);
    checkboxValidatorResult = checkboxValidator(checkboxGroup); 
    expect(checkboxValidatorResult).toBeNull();
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

  it('submitApp() should function correctly', (done: DoneFn) => {
    component.formQuestions.at(0).get('item1')!.setValue(true);
    component.formQuestions.at(0).get('item3')!.setValue(true);
    component.formQuestions.at(1).setValue('option2');
    component.formQuestions.at(2).setValue('Some test details.');
    component.onSubmit();
    fixture.detectChanges();
    
    expect(createApplicationSpy).withContext('createApplication() called').toHaveBeenCalledOnceWith({
      projectID: testProjectData.projectID,
      professorEmail: testProjectData.professorEmail,
      questions: [
        {
          ...testQuestionData[0],
          answers: ['item1', 'item3'],
        },
        {
          ...testQuestionData[1],
          answers: ['option2'],
        },
        {
          ...testQuestionData[2],
          answers: ['Some test details.'],
        },
      ],
    });
    expect(navigateSpy).withContext('navigate() called').toHaveBeenCalledOnceWith(['/student-dashboard']);
    done();
  });

  it('HTML should include correct information', () => {
    const applyElement: HTMLElement = fixture.nativeElement;
    expect(applyElement.textContent).toContain('Test Project');
    expect(applyElement.textContent).toContain('2.00');
    const checkBoxes = applyElement.querySelectorAll('mat-checkbox');
    expect(checkBoxes.length).toEqual(3);
    for (let i = 0; i < checkBoxes.length; i++) {
      expect(checkBoxes.item(i).textContent).toEqual('item' + (i + 1));
    }
    const radioButtons = applyElement.querySelectorAll('mat-radio-button');
    expect(radioButtons.length).toEqual(3);
    for (let i = 0; i < radioButtons.length; i++) {
      expect(radioButtons.item(i).textContent).toEqual('option' + (i + 1));      
    }
    const textArea = applyElement.querySelector('textarea');
    expect(textArea).toBeTruthy();
  });
});
