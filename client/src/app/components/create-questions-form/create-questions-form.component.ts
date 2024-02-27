import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface RequirementOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-create-questions-form',
  templateUrl: './create-questions-form.component.html',
  styleUrls: ['./create-questions-form.component.css']
})
export class CreateQuestionsFormComponent {
  @Input() questionsGroup: FormGroup;

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

  get questions() {
    return this.questionsGroup.get('questions') as FormArray;
  }

  getQuestionChoices(index: number) {
    const questionGroup = this.questions.at(index) as FormGroup;
    return questionGroup.get('choices') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      question: ['', Validators.required],
      requirementType: ['', Validators.required],
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
