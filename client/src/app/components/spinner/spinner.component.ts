import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../../controllers/load-controller/loader.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [NgIf]
})
export class SpinnerComponent {
  constructor(public loader: LoaderService) { }
}