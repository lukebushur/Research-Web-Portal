import { Component, ElementRef, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-question',
  templateUrl: './custom-question.component.html',
  styleUrls: ['./custom-question.component.css'],
})
export class CustomQuestionComponent {
  @Input() typeStr = ''; //The type of question, i.e. text box, radio buttons, or text
  @Input() questionStr = ''; //The actual question written by the faculty

  question = new FormControl(this.questionStr); //Form control for the question
  form: FormGroup; //FormGroup for the custom question form

  constructor(private host: ElementRef<HTMLElement>, private fb: FormBuilder) { }

  ngOnInit() {  //On initalization, create a formGroup with the question, options, required, and type fields
    this.form = this.fb.group({ //Form group for the form containing the options, required, and type fields
      options: this.fb.array([]), //Choices for a radio button/checkbox question
      required: [true], //A boolean to indicate if the question will be required by the faculty member
      type: [this.typeStr], //The type of question, i.e. text box, radio buttons, or text
    });

    this.options.push(this.fb.control('New Option'));
  }

  //sets up the formGroup options array
  get options() {
    return (this.form.get('options') as FormArray);
  }

  @Output() deleted = new EventEmitter<any>();

  //this delete the componenet, and emits a delete event
  onDelete() {
    this.host.nativeElement.remove();
    this.deleted.emit(null);
  }

  //this simply pushes a nex element to the formGroup's option array
  addOption() {
    this.options.push(this.fb.control('New Option'));
  }

  //This simply removes an element at the formGroup's option array location
  removeOption(index: number) {
    this.options.removeAt(index);
  }

  //This method is used to get the data from the component
  getData(): any {
    //first, it maps the option values from the formGroup array of options, then it creates an object containg the necessary question information
    const optionValues = this.options.controls.map((control) => control.value);
    let obj = {
      question: this.question.value,
      type: this.form.get('type')?.value,
      required: this.form.get('required')?.value,
      choices: optionValues,
    };

    return obj;
  }
}
