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
  selector: 'category-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input type="checkbox" name={{name}} value="cs">
    <input type="text" value="{{ name }}" name="cs"><input type="button" (click)="onClick()" value="Delete"><br>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CategoryComponent {

  @Output() deleted = new EventEmitter<any>();

  constructor(private host: ElementRef<HTMLElement>) {}

  onClick() {
    // Deletes local element then fires the Observable to tell the parent "hey I killed myself!"
    this.host.nativeElement.remove();
    this.deleted.emit(null);
  }

  @Input() name: string = "This is a test";
}