import { Component } from '@angular/core';
import { LoadingService } from '../loading-service/loading.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
  imports: [MatProgressSpinnerModule, AsyncPipe]
})
export class LoadingSpinnerComponent {

  loading$: Observable<boolean>;

  constructor(public loadingService: LoadingService) {
    this.loading$ = loadingService.getLoading();
  }
}
