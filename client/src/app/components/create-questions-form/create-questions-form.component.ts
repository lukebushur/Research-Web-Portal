import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

interface RequirementOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-create-questions-form',
  templateUrl: './create-questions-form.component.html',
  styleUrls: ['./create-questions-form.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class CreateQuestionsFormComponent {
  @Input() questionsGroup: FormGroup;

  @Input() questionsData?: QuestionData[];
  isCreateForm: boolean = true;

  reqTypes: RequirementOption[] = [
    {
      name: 'Text',
      value: 'text'
    },
    {
      name: 'Single Select',
      value: 'radio button'
    },
    {
      name: 'Multiple Select',
      value: 'check box'
    },
  ];

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (!this.questionsData) {
      this.addQuestion();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionsData'].previousValue || !changes['questionsData'].currentValue) {
      return;
    }
    if (!this.isCreateForm) {
      return;
    }
    this.isCreateForm = false;
    this.questions.clear();

    for (const question of this.questionsData!) {
      const questionGroup = this.fb.group({
        question: [question.question, [Validators.required]],
        requirementType: [question.requirementType, [Validators.required]],
        required: [question.required, [Validators.required]],
        choices: (question.choices)
          ? this.fb.array(question.choices.map(choice => {
            return this.fb.control(choice, [Validators.required]);
          }))
          : this.fb.array([this.fb.control('', [Validators.required])]),
      });
      if (question.requirementType === 'text') {
        questionGroup.get('choices')?.disable();
      }
      this.questions.push(questionGroup);
    }
  }

  get questions() {
    return this.questionsGroup.get('questions') as FormArray;
  }

  getQuestionChoices(index: number) {
    const questionGroup = this.questions.at(index) as FormGroup;
    return questionGroup.get('choices') as FormArray;
  }

  // Error message for fields with only Validators.required
  requiredArrayFieldErrorMessage(index: number, fieldName: string, displayName: string): string {
    if (this.questions.at(index).get(fieldName)?.hasError('required')) {
      return displayName + ' is a required field';
    }
    return '';
  }

  // Error message for a question choice
  choiceErrorMessage(qindex: number, cindex: number, displayName: string): string {
    if (this.getQuestionChoices(qindex).at(cindex).hasError('required')) {
      return displayName + ' is a required field';
    }
    return '';
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      question: ['', [Validators.required]],
      requirementType: ['', [Validators.required]],
      required: [true, [Validators.required]],
      choices: this.fb.array([this.fb.control('', [Validators.required])]),
    })
    questionGroup.get('choices')?.disable();
    this.questions.push(questionGroup);
  }

  updateQuestion(index: number) {
    if (this.questions.at(index).get('requirementType')?.value === 'text') {
      this.getQuestionChoices(index).disable();
    } else {
      this.getQuestionChoices(index).enable();
    }
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  addChoice(index: number) {
    this.getQuestionChoices(index).push(this.fb.control('', [Validators.required]));
  }

  removeChoice(qindex: number, cindex: number) {
    this.getQuestionChoices(qindex).removeAt(cindex);
  }
}
