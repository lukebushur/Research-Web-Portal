import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { CreateQuestionsFormComponent } from './create-questions-form.component';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';

describe('CreateQuestionsFormComponent', () => {
  let component: CreateQuestionsFormComponent;
  let fixture: ComponentFixture<CreateQuestionsFormComponent>;
  const questionsGroup = new FormGroup({
    questions: new FormArray([]),
  });

  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        CreateQuestionsFormComponent,
      ],
    });
    fixture = TestBed.createComponent(CreateQuestionsFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.questionsGroup = questionsGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error when you don\'t put anything in the question field', async () => {
    // get the question html input by the formgroup question
    const question1Div = await loader.getChildLoader('#Question0');
    const Inputs = await question1Div.getAllHarnesses(MatInputHarness); // Returns an array
    // Find the input with the "Question" label
    const QuestionInput = await Inputs.find(async (input) => await input.getName() === 'Question');
    await QuestionInput?.setValue('');
    expect(component.questions.at(0).get('question')?.invalid).toBe(true);
  });

  it('should show text input when selecting a text question', async () => {
    const question1Div = await loader.getChildLoader('#Question0');
    const SelectMenu = await question1Div.getHarness(MatSelectHarness);
    // Ok now we're going to select the text harness
    await SelectMenu.open();
    const SingleSelectButton = (await SelectMenu.getOptions())[0]; // This is the Text option
    await SingleSelectButton.click();
    // Ok now we want to make sure there isn't a choice button
    const AddChoice = await question1Div.getHarnessOrNull(MatButtonHarness.with({ text: 'Add Choice' }));
    expect(AddChoice).toBeNull();
  });

  it('should show choices when selecting a single-select or multi-select question', async () => {

    const question1Div = await loader.getChildLoader('#Question0');
    const SelectMenu = await question1Div.getHarness(MatSelectHarness);

    // Ok now we're going to select the text harness
    await SelectMenu.open(); // Open it
    const SingleSelectButton = (await SelectMenu.getOptions())[1]; // This is the Text option
    await SingleSelectButton.click(); // Now click it!
    // Ok now we want to make sure there isn't a choice button
    let AddChoice = await question1Div.getHarnessOrNull(MatButtonHarness.with({ text: 'Add Choice' }));

    expect(AddChoice).withContext('to exist').toBeTruthy();

    await SelectMenu.open();
    const MultiSelectButton = (await SelectMenu.getOptions())[2]; // This is the Text option
    await MultiSelectButton.click();
    AddChoice = await question1Div.getHarnessOrNull(MatButtonHarness.with({ text: 'Add Choice' }));

    expect(AddChoice).withContext('to exist too').toBeTruthy();
  });

  it('add question should generate a new question', async () => {
    const CreateQuestionButton = await loader.getHarness(MatButtonHarness.with({ text: 'Add Question' }));
    await CreateQuestionButton.click();
    // Make sure that there is a Question1 div now
    const question1Div = await loader.getChildLoader('#Question1');
    expect(question1Div).toBeTruthy();
  });

  it('should remove a question when the remove button is clicked', async () => {
    const question1Div = await loader.getChildLoader('#Question0');
    const RemoveButton = await question1Div.getHarness(MatButtonHarness.with({ text: 'Remove Question' }));
    const prevLength = component.questions.length;
    await RemoveButton.click();
    // Make sure that question 0 has been removed from questions (there is no question 0)
    // for some reason this floats between 5 questions and 1 question, so just seeing if it removed one is a good thing
    expect(component.questions.length < prevLength).toBe(true);
  });

  it('should set required to false when clicking it', async () => {
    const question1Div = await loader.getChildLoader('#Question0');
    const RequiredFalse = await question1Div.getHarness(MatRadioButtonHarness.with({ label: 'No' }));
    await RequiredFalse.check();
    // Check if the question is required still
    expect(component.questions.at(0).get('required')?.value).toBe(false);
  });
});
