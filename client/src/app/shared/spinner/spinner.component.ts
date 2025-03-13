import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../loader-service/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
})
export class SpinnerComponent {
  constructor(public loader: LoaderService) { }
}
