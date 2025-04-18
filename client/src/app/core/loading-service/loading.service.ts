import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private numRequests = 0;
  // whether an HTTP request is currently in progress
  private loadingSubject = new BehaviorSubject(false);

  // increment the number of requests currently processing
  incrementRequests() {
    if (this.numRequests === 0) {
      this.loadingSubject.next(true);
    }

    this.numRequests++;
  }

  // decrement the number of requests currently processing
  decrementRequests() {
    this.numRequests--;
    if (this.numRequests === 0) {
      this.loadingSubject.next(false);
    }
  }

  // get the current value of loading
  getLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
