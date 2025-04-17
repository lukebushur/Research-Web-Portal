import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { QuestionData } from '../models/questionData';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-question-card',
  imports: [
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
  ],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.css'
})
export class QuestionCardComponent {
  readonly questionNum = input.required<number>();

  readonly questionData = input.required<QuestionData>();
  readonly isRadio = computed<boolean>(() =>
    this.questionData().requirementType === "radio button"
  );
  readonly isCheckbox = computed<boolean>(() =>
    this.questionData().requirementType === "check box"
  );

  readonly showAnswer = input<boolean>(false);

  // Return a more understandable string for displaying what the given question
  // requirementType is
  displayRequirementType(reqType: string): string {
    if (reqType === 'text') {
      return 'Text Response';
    } else if (reqType === 'radio button') {
      return 'Single Select';
    } else if (reqType === 'check box') {
      return 'Multiple Select';
    }
    return 'Invalid Question Type';
  }
}
