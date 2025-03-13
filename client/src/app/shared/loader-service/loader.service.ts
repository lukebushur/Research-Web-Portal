import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // whether an HTTP request is currently in progress
  private loading: boolean = false;

  constructor() { }

  // set loading to the given value
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  // get the current value of loading
  getLoading(): boolean {
    return this.loading;
  }
}