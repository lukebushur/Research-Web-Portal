import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataSharingService {

  constructor() {
    this.AppliedStudentList = new BehaviorSubject<any[]>([]);
  }

  projectID: String;
  AppliedStudentList: BehaviorSubject<any[]>; 
  count = 0;
  
  updateData(newData: any[]): void {
    console.log("data Updated" + this.projectID);

    this.AppliedStudentList.next(newData);
  }

  getData(){
    return this.projectID;
  }

}
