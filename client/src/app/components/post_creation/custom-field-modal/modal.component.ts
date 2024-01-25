import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

export interface CustomFieldDialogData {
  type: string;
  fieldName: string;
}

@Component({
  selector: 'custom-field-dialog',
  templateUrl: 'modal-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
  providers: [BrowserAnimationsModule]
})
export class CustomFieldDialogue {
  constructor(
    public dialogRef: MatDialogRef<CustomFieldDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: CustomFieldDialogData
  ) {}
  
  formIsValid: boolean = false; 
  type: string = "test"; //this type is used to determine what question type will be created through the question component
  question: string = ""; //this string is the actual text of the question
  create: boolean = false; //this boolean is used to determine if the question componenet should be created in the post creation component

  //This method is used to send the necessary information to create a new question component, it should only be called if the form is valid
  onCreate(): void { 
    this.create = true;
    let obj = {
      question: this.question,
      type: this.type,
      create: this.create,
    }
    this.dialogRef.close(obj);
  } 

  //This is used to handle the cancelation of the create question component.
  onCancel(): void {
    this.create = false;
    this.dialogRef.close();
  }
}