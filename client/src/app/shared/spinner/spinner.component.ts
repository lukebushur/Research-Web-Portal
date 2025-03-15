import { Component } from '@angular/core';
import { LoaderService } from '../loader-service/loader.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  imports: [MatProgressSpinnerModule, AsyncPipe]
})
export class SpinnerComponent {

  loading$: Observable<boolean>;

  constructor(public loaderService: LoaderService) {
    this.loading$ = loaderService.getLoading();
  }
}
