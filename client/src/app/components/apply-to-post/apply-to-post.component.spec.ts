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

  // it('should create and initialize project data', () => {
  //   expect(component).toBeTruthy();
  //   // Expect the project to be set correctly after ngOnInit
  //   expect(component.project).toEqual({
  //     ...testProjectData,
  //     questions: testQuestionData.map((question, i) => {
  //       return {
  //         ...question,
  //         questionNum: i + 1,
  //       };
  //     }),
  //   });
  //   // Expect the form values to be set correctly after ngOnInit
  //   expect(component.formQuestions.value).toEqual([
  //     // Question 1 Answers
  //     {
  //       item1: false,
  //       item2: false,
  //       item3: false,
  //     },
  //     // Question 2 Answers
  //     '',
  //     // Question 3 Answers
  //     '',
  //   ]);
  //   expect(getProjectInfoSpy).withContext('getProjectInfo() called with test data').toHaveBeenCalledOnceWith({
  //     professorEmail: testProjectData.professorEmail,
  //     projectID: testProjectData.projectID,
  //   });
  // });

  // // it('getCheckBoxControl() should function correctly', () => {
  // //   // valid function call
  // //   expect(component.getCheckBoxControl(0, 'item1')!.value).toBeFalse();
  // //   // invalid index (not a checkbox question)
  // //   expect(component.getCheckBoxControl(1, 'item1')).toBeNull();
  // //   // invalid value (not a possible choice)
  // //   expect(component.getCheckBoxControl(0, 'none')).toBeUndefined();
  // // });

  // // it('requireCheckboxesToBeChecked() should function correctly', () => {
  // //   const checkboxGroup = new FormGroup({
  // //     'one': new FormControl(false),
  // //     'two': new FormControl(false),
  // //     'three': new FormControl(false),
  // //   });
  // //   const checkboxValidator = component.requireCheckboxesToBeChecked(1);
  // //   let checkboxValidatorResult = checkboxValidator(checkboxGroup); 
  // //   // should not pass validation, as all checkbox controls are false
  // //   expect(checkboxValidatorResult).toEqual({ requireCheckboxesToBeChecked: true });
  // //   checkboxGroup.get('two')?.setValue(true);
  // //   checkboxValidatorResult = checkboxValidator(checkboxGroup); 
  // //   // should pass validation, as at least one checkbox control is true
  // //   expect(checkboxValidatorResult).toBeNull();
  // // });

  // // it('categoriesString() should function correctly', () => {
  // //   expect(component.categoriesString()).toEqual('Technology, Documentation, Writing');
  // // });

  // // it('majorsString() should function correctly', () => {
  // //   expect(component.majorsString()).toEqual('Computer Science, Theatre');
  // // });

  // it('formatGPA() should function correctly', () => {
  //   expect(component.formatGPA()).toEqual('2.00');
  // });

  // it('dateToString() should function correctly', () => {
  //   // no date given
  //   const dateStr = component.project.deadline;
  //   // with date given
  //   expect(component.dateToString(dateStr)).toEqual('Mar 17, 2024');
  // });

  // it('submitApp() should function correctly', (done: DoneFn) => {
  //   // set applyForm to valid values
  //   component.formQuestions.at(0).get('item1')!.setValue(true);
  //   component.formQuestions.at(0).get('item3')!.setValue(true);
  //   component.formQuestions.at(1).setValue('option2');
  //   component.formQuestions.at(2).setValue('Some test details.');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(createApplicationSpy).withContext('createApplication() called').toHaveBeenCalledOnceWith({
  //     projectID: testProjectData.projectID,
  //     professorEmail: testProjectData.professorEmail,
  //     questions: [
  //       {
  //         ...testQuestionData[0],
  //         answers: ['item1', 'item3'],
  //       },
  //       {
  //         ...testQuestionData[1],
  //         answers: ['option2'],
  //       },
  //       {
  //         ...testQuestionData[2],
  //         answers: ['Some test details.'],
  //       },
  //     ],
  //   });
  //   expect(navigateSpy).withContext('navigate() called').toHaveBeenCalledOnceWith(['/student/dashboard']);
  //   done();
  // });

  // it('HTML should include correct information', () => {
  //   fixture.detectChanges();
  //   const applyElement: HTMLElement = fixture.nativeElement;
    
  //   // Test project name and GPA
  //   expect(applyElement.textContent).toContain(testProjectData.projectName);
  //   expect(applyElement.textContent).toContain(component.formatGPA());
    
  //   // Test checkboxes
  //   const checkBoxes = applyElement.querySelectorAll('mat-checkbox');
  //   if (testQuestionData[0] && testQuestionData[0].choices && checkBoxes) {
  //     expect(checkBoxes.length).toEqual(testQuestionData[0].choices.length);
  //     testQuestionData[0].choices.forEach((choice, index) => {
  //       const checkBox = checkBoxes.item(index);
  //       if (checkBox) {
  //         expect(checkBox.textContent?.trim()).toEqual(choice);
  //       }
  //     });
  //   }
    
  //   // Test radio buttons
  //   const radioButtons = applyElement.querySelectorAll('mat-radio-button');
  //   if (testQuestionData[1] && testQuestionData[1].choices && radioButtons) {
  //     expect(radioButtons.length).toEqual(testQuestionData[1].choices.length);
  //     testQuestionData[1].choices.forEach((choice, index) => {
  //       const radioButton = radioButtons.item(index);
  //       if (radioButton) {
  //         expect(radioButton.textContent?.trim()).toEqual(choice);
  //       }
  //     });
  //   }
    
  //   // Test text area
  //   const textArea = applyElement.querySelector('textarea');
  //   expect(textArea).toBeTruthy();
  // }); 
   

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
    // Add more assertions as needed...
  });

  it('should correctly format GPA', () => {
    // Assuming GPA is 2.0 in test data
    expect(component.formatGPA()).toBe('2.00');
  });

  it('should correctly convert date to string', () => {
    const dateStr = '2024-03-17T00:00:01.000Z'; // Assuming deadline in ISO format
    expect(component.dateToString(dateStr)).toBe('Mar 17, 2024');
  });
  
  // it('should correctly navigate to student app overview after successful submission', async () => {
  //   // spyOn(component, 'onSubmit').and.callThrough();
  //   const snackBarOpenSpy = spyOn(component['snackBar'], 'open').and.stub(); // Stubbing MatSnackBar open method
  
  //   await component.onSubmit(); // Assuming onSubmit returns a Promise
    
  //   // Since onSubmit should have been called and awaited, we check if navigate and snackBar open methods were called after that
  //   expect(navigateSpy).toHaveBeenCalledWith(['/student/applications-overview']);
  //   expect(snackBarOpenSpy).toHaveBeenCalledWith('Application submitted!', 'Close', { duration: 5000 });
  // });
  

  // it('should handle error if application submission fails', () => {
  //   spyOn(component, 'onSubmit').and.callThrough();
  //   createApplicationSpy.and.returnValue(throwError('Error submitting application.'));
  //   component.onSubmit();
  //   fixture.whenStable().then(() => {
  //     expect(snackBarOpenSpy).toHaveBeenCalledWith('Error submitting application.', 'Close', { duration: 5000 });
  //   });
  // });
});
