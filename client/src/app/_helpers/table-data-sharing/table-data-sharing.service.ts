import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataSharingService {

  constructor() {
    this.AppliedStudentList = new BehaviorSubject<any[]>([]);
  }

  AppliedStudentList: BehaviorSubject<any[]>;
  
  updateData(newData: any[]): void {
    this.AppliedStudentList.next(newData);
  }

  getData(): Observable<any[]> {
    return this.AppliedStudentList.asObservable();
  }

}
