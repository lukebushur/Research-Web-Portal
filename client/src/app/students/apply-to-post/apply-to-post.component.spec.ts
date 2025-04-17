import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatStepperModule } from '@angular/material/stepper';
import { ApplyToPostComponent } from './apply-to-post.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { StudentService } from '../student-service/student.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionData } from 'app/shared/models/questionData';
import { StudentProjectInfo } from '../models/student-project-info';
import { Component, input } from '@angular/core';
import { ProjectInfoCardComponent } from 'app/shared/project-info-card/project-info-card.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatStepperHarness } from '@angular/material/stepper/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';

@Component({
  selector: 'app-project-info-card',
  template: '<h1 id="projInfo">Project Information Component</h1>'
})
class ProjectInfoCardStubComponent {
  readonly professorEmail = input.required<string>();
  readonly project = input.required<StudentProjectInfo>();
}

describe('ApplyToPostComponent', () => {
  let component: ApplyToPostComponent;
  let fixture: ComponentFixture<ApplyToPostComponent>;
  let loader: HarnessLoader;

  let studentService: jasmine.SpyObj<StudentService>;
  let router: jasmine.SpyObj<Router>;

  // Mock question data
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
      required: false,
      choices: ['option1', 'option2', 'option3'],
    },
    {
      question: 'Please describe your details.',
      requirementType: 'text',
      required: true,
    },
  ];
  const professorEmail = 'testemail@email.com';
  const projectId = '1234';
  // Mock project data
  const testProjectData: StudentProjectInfo = {
    professorName: 'Test Professor',
    professorId: '123',
    projectName: 'Test Project',
    description: 'This project is for testing.',
    categories: ['Technology', 'Documentation', 'Writing'],
    GPA: 2.0,
    majors: ['Computer Science', 'Theatre'],
    posted: new Date('Fri Feb 16 2024'),
    deadline: new Date('Sun Mar 17 2024'),
    questions: questionData,
  };
  const createApplicationResponse = {
    success: {
      status: 200,
      message: 'APPLICATION_CREATED',
    }
  };

  beforeEach(() => {
    // Spy object for StudentService. Captures the provided function calls and returns
    // predictable mock data instead.
    studentService = jasmine.createSpyObj<StudentService>('StudentService', [
      'getProjectInfo',
      'createApplication',
    ]);
    studentService.getProjectInfo.and.returnValue(of(testProjectData));
    studentService.createApplication.and.returnValue(of(createApplicationResponse));

    // Spy object for Router. Captures the provided function calls and returns
    // predictable mock data instead.
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [
        ApplyToPostComponent,
        FormsModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSidenavModule,
        MatListModule,
        MatStepperModule,
        NoopAnimationsModule,
      ],
      providers: [
        // Use Jasmine spy objects instead of the actual services/classes
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                profName: testProjectData.professorName,
                profEmail: professorEmail,
                oppId: projectId,
              })
            }
          }
        },
        { provide: StudentService, useValue: studentService },
      ],
    }).overrideComponent(ApplyToPostComponent, {
      remove: { imports: [ProjectInfoCardComponent] },
      add: { imports: [ProjectInfoCardStubComponent] },
    });
    fixture = TestBed.createComponent(ApplyToPostComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize project data', () => {
    // Expect the project to be set correctly after ngOnInit
    expect(component.project).toEqual({
      ...testProjectData,
      questions: questionData.map((question, i) => {
        return {
          ...question,
          questionNum: i + 1,
        };
      }),
    });

    // Expect the form values to be set correctly after ngOnInit
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
    expect(studentService.getProjectInfo)
      .withContext('getProjectInfo() called with test data')
      .toHaveBeenCalledOnceWith(professorEmail, projectId);
  });

  it('getCheckBoxControl() should function correctly', () => {
    // valid function call
    expect(component.getCheckBoxControl(0, 'item1')!.value).toBeFalse();
    // invalid index (not a checkbox question)
    expect(component.getCheckBoxControl(1, 'item1')).toBeNull();
    // invalid value (not a possible choice)
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

    // should not pass validation, as all checkbox controls are false
    expect(checkboxValidatorResult).toEqual({ requireCheckboxesToBeChecked: true });

    checkboxGroup.get('two')?.setValue(true);
    checkboxValidatorResult = checkboxValidator(checkboxGroup);

    // should pass validation, as at least one checkbox control is true
    expect(checkboxValidatorResult).toBeNull();
  });

  it('onSubmit() should function correctly', async () => {
    // set applyForm to valid values
    component.formQuestions.at(0).get('item1')!.setValue(true);
    component.formQuestions.at(0).get('item3')!.setValue(true);
    component.formQuestions.at(1).setValue('option2');
    component.formQuestions.at(2).setValue('Some test details.');
    component.onSubmit();

    const expectedData = {
      projectID: projectId,
      professorEmail: professorEmail,
      questions: [
        {
          ...questionData[0],
          answers: ['item1', 'item3'],
        },
        {
          ...questionData[1],
          answers: ['option2'],
        },
        {
          ...questionData[2],
          answers: ['Some test details.'],
        },
      ],
    };
    for (const question of expectedData.questions) {
      delete question.questionNum;
    }

    expect(studentService.createApplication)
      .withContext('createApplication() called')
      .toHaveBeenCalledOnceWith(expectedData);
    expect(router.navigate)
      .withContext('navigate() called')
      .toHaveBeenCalledOnceWith(['/student/applications-overview']);

    const snackBar = await loader.getHarness(MatSnackBarHarness);
    expect(await snackBar.getMessage()).toBe('Application submitted!');
  });

  it('should dispay a stepper with project details in the first step', async () => {
    const stepper = await loader.getHarness(MatStepperHarness);
    const steps = await stepper.getSteps();

    expect(steps.length).toEqual(2);
    expect(await steps[0].isSelected()).toBeTrue();
    expect(await steps[0].getLabel()).toEqual('Review Project Information');
    expect(await steps[1].getLabel()).toEqual('Complete Application Questions');

    const applyElement: HTMLElement = fixture.nativeElement;
    const projectInformation = applyElement.querySelector('#projInfo')!;
    expect(projectInformation.textContent).toEqual('Project Information Component');
  });

  it('should display application questions in the second step', async () => {
    const stepper = await loader.getHarness(MatStepperHarness);
    const steps = await stepper.getSteps();
    await steps[1].select();
    const questionCards = await loader.getAllHarnesses(MatCardHarness);

    expect(questionCards.length).toEqual(3);

    const checkCard = questionCards[0];
    const checkContent = await checkCard.getText();

    expect(await checkCard.getTitleText()).toEqual(`1. ${questionData[0].question} *`);
    for (const choice of questionData[0].choices!) {
      expect(checkContent).toContain(choice);
    }

    const radioCard = questionCards[1];
    const radioContent = await radioCard.getText();

    expect(await radioCard.getTitleText()).toEqual(`2. ${questionData[1].question}`);
    for (const choice of questionData[1].choices!) {
      expect(radioContent).toContain(choice);
    }

    const textCard = questionCards[2];
    expect(await textCard.getTitleText()).toEqual(`3. ${questionData[2].question} *`);
    expect((await textCard.getAllHarnesses(MatInputHarness)).length).toEqual(1);
  });

  it('should complete the application, calling createApplication and redirecting', async () => {
    const stepper = await loader.getHarness(MatStepperHarness);
    const steps = await stepper.getSteps();
    await steps[1].select();
    const questionCards = await loader.getAllHarnesses(MatCardHarness);

    const checkCard = questionCards[0];
    const checkBoxes = await checkCard.getAllHarnesses(MatCheckboxHarness);
    expect(checkBoxes.length).toEqual(3);
    await checkBoxes[0].check();
    await checkBoxes[2].check();

    const radioCard = questionCards[1];
    const radioGroup = await radioCard.getHarness(MatRadioGroupHarness);
    const radioButtons = await radioGroup.getRadioButtons();
    expect(radioButtons.length).toEqual(3);
    await radioButtons[1].check();

    const textCard = questionCards[2];
    const textarea = await textCard.getHarness(MatInputHarness);
    await textarea.setValue('My answer.');

    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toEqual(4);
    const submitButton = buttons[3];
    await submitButton.click();

    expect(studentService.createApplication).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/student/applications-overview']);

    const snackBar = await loader.getHarness(MatSnackBarHarness);
    expect(await snackBar.getMessage()).toBe('Application submitted!');
  });
});
