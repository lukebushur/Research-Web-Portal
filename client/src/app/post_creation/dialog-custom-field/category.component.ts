import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  Output
} from '@angular/core';

@Component({
  selector: 'requirement-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>{{fieldName}}</p>

    <div *ngIf="isText">
      <textarea id="disabledInputField" name="inputPlaceholder" disabled rows="4" cols="50">
        Students will type their responses in here.
      </textarea>
    </div>

    <div *ngIf="!isText">
      <input type="radio" id="yes" name="{{fieldName}}" value="yes">
      <label for="html">Yes</label><br>
      <input type="radio" id="no" name="{{fieldName}}" value="no">
      <label for="css">No</label><br>
    </div>

    <input type="button" (click)="onClick()" value="Delete"><br>
  `,
  styleUrls: ['./category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRequirementCreator {

  @Output() deleted = new EventEmitter<any>();

  constructor(private host: ElementRef<HTMLElement>) {}

  onClick() {
    this.host.nativeElement.remove();
    this.deleted.emit(null);
  }

  isText: boolean = true;
  fieldName: string = "Placeholder String";

}