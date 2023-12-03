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
  selector: 'add-category-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label>{{ fieldName }}</label><br>
    <div *ngIf="isText">
      <textarea id="disabledInputField" name="inputPlaceholder" disabled rows="4" cols="50">
        Students will type their responses in here.
      </textarea>
    </div>
    <div *ngIf="!isText">
      
    </div>
    <br>
    <input type="button" (click)="onClick()" value="Delete"><br>
  `,
  styleUrls: ['./field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes are happen');
  }


  @Output() deleted = new EventEmitter<any>();

  constructor(private host: ElementRef<HTMLElement>) {}

  onClick() {
    this.host.nativeElement.remove();
    this.deleted.emit(null);
  }

  @Input() isText: boolean = true;
  @Input() fieldName: string = "Placeholder String";

}