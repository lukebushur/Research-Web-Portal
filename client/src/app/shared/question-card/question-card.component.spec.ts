import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCardComponent } from './question-card.component';
import { QuestionData } from '../models/questionData';

const questionsData: QuestionData[] = [
  {
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
  },
  {
    question: 'Describe',
    required: true,
    requirementType: 'text',
    answers: [
      'many details',
    ],
  },
  {
    question: 'Choose multiple',
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
  },
];

describe('QuestionCardComponent', () => {
  let component: QuestionCardComponent;
  let fixture: ComponentFixture<QuestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('questionNum', 1);
    fixture.componentRef.setInput('questionData', questionsData[0]);
    fixture.componentRef.setInput('showAnswer', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
