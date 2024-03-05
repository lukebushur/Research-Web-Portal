import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//This service is a small service that handles the conversion of time to local time. This way the student/professors do not get confused
//and the server does not need a complicated program to send the correct time
export class DateConverterService {

  constructor() { }

  //This function converts the date in the parameter into a local date, then returns the local date string and time.
  convertDate(date: Date): String {
    let localDate = new Date(date);
    return localDate.toLocaleDateString() + " " + localDate.toLocaleTimeString();
  }

  convertShortDate(date: Date) : String {
    let localDate = new Date(date);
    return localDate.toLocaleDateString();
  }
}
