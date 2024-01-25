import { Component, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-question',
  templateUrl: './custom-question.component.html',
  styleUrls: ['./custom-question.component.css'],
})
export class CustomQuestionComponent {
  form: FormGroup; //Form group to be used for building the form
  type: string = ''; //the type of question, i.e. text box, radio buttons, or text
  required: boolean = true; //A boolean to indicate if the question will be required by the faculty member
  question: String = ""; //The actual question written by the faculty

  constructor(private host: ElementRef<HTMLElement>, private fb: FormBuilder) { }

  ngOnInit() {  //On initalization, create a formGroup with the question, options, required, and type fields
    this.form = this.fb.group({
      question: this.question,
      options: this.fb.array([]),
      required: this.required,
      type: this.type,
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
  getData() : any { 
    //first, it maps the option values from the formGroup array of options, then it creates an object containg the necessary question information
    const optionValues = this.options.controls.map((control) => control.value);
    let obj = {
      question : this.question,
      type : this.type,
      required : this.required,
      choices : optionValues,
    };

    return obj;
  }
}
