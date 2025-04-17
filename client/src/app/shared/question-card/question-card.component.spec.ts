import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCardComponent } from './question-card.component';
import { QuestionData } from '../models/questionData';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatInputHarness } from '@angular/material/input/testing';

const radioQuestion: QuestionData = {
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
};
const textQuestion: QuestionData = {
  question: 'Describe Your Answer',
  required: false,
  requirementType: 'text',
  answers: [
    'Many details',
  ],
};
const checkQuestion: QuestionData = {
  question: 'Choose Multiple',
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
};

describe('QuestionCardComponent', () => {
  let component: QuestionCardComponent;
  let fixture: ComponentFixture<QuestionCardComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionCardComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('Radio Button, Show Answer', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questionNum', 1);
      fixture.componentRef.setInput('questionData', radioQuestion);
      fixture.componentRef.setInput('showAnswer', true);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the question as the card title', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual('1. Choose One *');
    });

    it('should display the question details', async () => {
      const card = await loader.getHarness(MatCardHarness);
      const content = await card.getText();

      expect(content).toContain('Required');
      expect(content).toContain('Question Type:');
      expect(content).toContain('Single Select');
      expect(content).toContain('Answer:');
    });

    it('should display the question choices with answer', async () => {
      const questionElement: HTMLElement = fixture.nativeElement;
      const ulElement: HTMLUListElement = questionElement.querySelector('ul.choices')!;

      expect(ulElement.children.length).toEqual(2);

      const liElements = ulElement.querySelectorAll('li.choice');

      expect(liElements[0].textContent).toContain('radio_button_checked');
      expect(liElements[0].textContent).toContain('option 1');
      expect(liElements[1].textContent).toContain('radio_button_unchecked');
      expect(liElements[1].textContent).toContain('option 2');
    });
  });

  describe('Radio Button, Do Not Show Answer', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questionNum', 2);
      fixture.componentRef.setInput('questionData', radioQuestion);
      fixture.componentRef.setInput('showAnswer', false);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the question as the card title', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual('2. Choose One *');
    });

    it('should display the question details', async () => {
      const card = await loader.getHarness(MatCardHarness);
      const content = await card.getText();

      expect(content).toContain('Required');
      expect(content).toContain('Question Type:');
      expect(content).toContain('Single Select');
      expect(content).toContain('Choices:');
    });

    it('should display the question choices', () => {
      const questionElement: HTMLElement = fixture.nativeElement;
      const ulElement: HTMLUListElement = questionElement.querySelector('ul.choices')!;

      expect(ulElement.children.length).toEqual(2);

      const liElements = ulElement.querySelectorAll('li.choice');

      expect(liElements[0].textContent).toContain('radio_button_unchecked');
      expect(liElements[0].textContent).toContain('option 1');
      expect(liElements[1].textContent).toContain('radio_button_unchecked');
      expect(liElements[1].textContent).toContain('option 2');
    });
  });

  describe('Text, Show Answer', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questionNum', 3);
      fixture.componentRef.setInput('questionData', textQuestion);
      fixture.componentRef.setInput('showAnswer', true);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the question as the card title', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual('3. Describe Your Answer');
    });

    it('should display the question details', async () => {
      const card = await loader.getHarness(MatCardHarness);
      const content = await card.getText();

      expect(content).toContain('Not Required');
      expect(content).toContain('Question Type:');
      expect(content).toContain('Text Response');
      expect(content).toContain('Answer:');
    });

    it('should display the answer', async () => {
      const textarea = await loader.getHarness(MatInputHarness);

      expect(await textarea.getValue()).toEqual('Many details');
    });
  });

  describe('Text, Do Not Show Answer', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questionNum', 4);
      fixture.componentRef.setInput('questionData', textQuestion);
      fixture.componentRef.setInput('showAnswer', false);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the question as the card title', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual('4. Describe Your Answer');
    });

    it('should display the question details', async () => {
      const card = await loader.getHarness(MatCardHarness);
      const content = await card.getText();

      expect(content).toContain('Not Required');
      expect(content).toContain('Question Type:');
      expect(content).toContain('Text Response');
      expect(content).not.toContain('Answer:');
    });

    it('should not display the answer', async () => {
      const textareas = await loader.getAllHarnesses(MatInputHarness);
      expect(textareas.length).toEqual(0);
    });
  });

  describe('Check Box, Show Answer', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questionNum', 5);
      fixture.componentRef.setInput('questionData', checkQuestion);
      fixture.componentRef.setInput('showAnswer', true);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the question as the card title', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual('5. Choose Multiple *');
    });

    it('should display the question details', async () => {
      const card = await loader.getHarness(MatCardHarness);
      const content = await card.getText();

      expect(content).toContain('Required');
      expect(content).toContain('Question Type:');
      expect(content).toContain('Multiple Select');
      expect(content).toContain('Answer(s):');
    });

    it('should display the question choices and answers', () => {
      const questionElement: HTMLElement = fixture.nativeElement;
      const ulElement: HTMLUListElement = questionElement.querySelector('ul.choices')!;

      expect(ulElement.children.length).toEqual(3);

      const liElements = ulElement.querySelectorAll('li.choice');

      expect(liElements[0].textContent).toContain('check_box');
      expect(liElements[0].textContent).toContain('choice 1');
      expect(liElements[1].textContent).toContain('check_box_outline_blank');
      expect(liElements[1].textContent).toContain('choice 2');
      expect(liElements[2].textContent).toContain('check_box');
      expect(liElements[2].textContent).toContain('choice 3');
    });
  });

  describe('Check Box, Do Not Show Answer', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questionNum', 6);
      fixture.componentRef.setInput('questionData', checkQuestion);
      fixture.componentRef.setInput('showAnswer', false);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the question as the card title', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual('6. Choose Multiple *');
    });

    it('should display the question details', async () => {
      const card = await loader.getHarness(MatCardHarness);
      const content = await card.getText();

      expect(content).toContain('Required');
      expect(content).toContain('Question Type:');
      expect(content).toContain('Multiple Select');
      expect(content).toContain('Choices:');
    });

    it('should display the question choices', () => {
      const questionElement: HTMLElement = fixture.nativeElement;
      const ulElement: HTMLUListElement = questionElement.querySelector('ul.choices')!;

      expect(ulElement.children.length).toEqual(3);

      const liElements = ulElement.querySelectorAll('li.choice');

      expect(liElements[0].textContent).toContain('check_box_outline_blank');
      expect(liElements[0].textContent).toContain('choice 1');
      expect(liElements[1].textContent).toContain('check_box_outline_blank');
      expect(liElements[1].textContent).toContain('choice 2');
      expect(liElements[2].textContent).toContain('check_box_outline_blank');
      expect(liElements[2].textContent).toContain('choice 3');
    });
  });
});
