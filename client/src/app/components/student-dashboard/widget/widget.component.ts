import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
} from '@angular/core';

export interface PostStucture {
  professor: string,
  requirements: string, // convert this to read requirement data
  title: string, 
  imageURL: Buffer | undefined
}

@Component({
  selector: 'dashboard-widget',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DashboardWidgetComponent {
  
  Posts: Array<ElementRef> = [];

  AddPost(postInfo: PostStucture): void {
    
  }

  @Input() category: string = "Computer Science";
}