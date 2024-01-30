import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQuestionComponent } from './custom-question.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomQuestionComponent', () => {
  let component: CustomQuestionComponent;
  let fixture: ComponentFixture<CustomQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomQuestionComponent],
      imports: [
        MatFormFieldModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(CustomQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomQuestionComponent); // Make sure to replace 'MyComponent' with the actual name of your component
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Add more test cases as needed for your component's functionality

  it('should add an option to the radio button options', () => {
    component.typeStr = 'radio buttons';
    const initialOptionsLength = component.options.controls.length;

    component.addOption();

    expect(component.options.controls.length).toBe(initialOptionsLength + 1);
  });

  it('should remove an option from the radio button options', () => {
    component.typeStr = 'radio buttons';
    const initialOptionsLength = component.options.controls.length;

    component.removeOption(0);

    expect(component.options.controls.length).toBe(initialOptionsLength - 1);
  });

  // Add more test cases for other functionalities

  it('should delete the form', () => {
    spyOn(component, 'onDelete');
    const deleteButton = fixture.debugElement.nativeElement.querySelector('button');
    deleteButton.click();

    expect(component.onDelete).toHaveBeenCalled();
  });
});
