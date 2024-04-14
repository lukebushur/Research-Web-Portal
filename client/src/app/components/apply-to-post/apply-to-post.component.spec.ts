import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ApplyToPostComponent } from './apply-to-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ProjectData } from 'src/app/_models/apply-to-post/projectData';
import { of, throwError } from 'rxjs';
import { ApplyToPostService } from 'src/app/controllers/apply-to-post/apply-to-post.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { };


describe('ApplyToPostComponent', () => {
  let component: ApplyToPostComponent;
  let fixture: ComponentFixture<ApplyToPostComponent>;
  let getProjectInfoSpy: jasmine.Spy;
  let snackBar: MatSnackBar;
  let snackBarOpenSpy: jasmine.Spy;

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
    // Spy object for ApplyToPostService. Captures the provided function calls and returns
    // predictable mock data instead.
    const applyService = jasmine.createSpyObj('ApplyToPostService', [
      'getProjectInfo',
      'createApplication',
    ]);
    getProjectInfoSpy = applyService.getProjectInfo.and.returnValue(of(structuredClone(getProjectInfoResponse)));
    createApplicationSpy = applyService.createApplication.and.returnValue(of(createApplicationResponse));

    // Spy object for Router. Captures the provided function calls and returns
    // predictable mock data instead.
    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate.and.returnValue(Promise.resolve(true));

    // Mock MatSnackBar
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    const snackBarOpenSpy = snackBar.open;

    TestBed.configureTestingModule({
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
        MatStepperModule,
        SpinnerSubComponent,
        MatCardModule,
        ApplyToPostComponent
      ],
      providers: [
        // Use Jasmine spy objects instead of the actual services/classes
        { provide: ApplyToPostService, useValue: applyService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                profName: testProjectData.professorName,
                profEmail: testProjectData.professorEmail,
                oppId: testProjectData.projectID,
              })
            }
          }
        },
        // Provide the MatSnackBar service
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    });
    fixture = TestBed.createComponent(ApplyToPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

 
  it('should correctly initialize formQuestions array', () => {
    expect(component.formQuestions).toBeDefined();
    expect(component.formQuestions instanceof FormArray).toBeTruthy();
    expect(component.formQuestions.length).toBe(3); // Assuming 3 questions in test data
  });

  it('should correctly set up checkbox form controls', () => {
    const checkBoxControls = component.formQuestions.at(0) as FormGroup;
    expect(checkBoxControls.controls['item1']).toBeDefined();
    expect(checkBoxControls.controls['item2']).toBeDefined();
    expect(checkBoxControls.controls['item3']).toBeDefined();
  });

  it('should correctly format GPA', () => {
    // Assuming GPA is 2.0 in test data
    expect(component.formatGPA()).toBe('2.00');
  });

  it('should correctly convert date to string', () => {
    const dateStr = '2024-03-17T00:00:01.000Z'; // Assuming deadline in ISO format
    expect(component.dateToString(dateStr)).toBe('Mar 17, 2024');
  });  
  
});
