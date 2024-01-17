import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//This service stores the applicants and project ID of the currently selected project, which allows the table in teh 
//faculty dashboard to be updated and change based on the selected project
export class TableDataSharingService { 
  constructor() {
    this.AppliedStudentList = new BehaviorSubject<any[]>([]);
  }

  projectID: String; //The projectID of the currently selected project
  AppliedStudentList: BehaviorSubject<any[]>; //The applied student list of the currently selected Project
  count = 0;
  
  updateData(newData: any[], id: number): void { //Method is used to update the data
    console.log("data Updated" + this.projectID);
    
    this.AppliedStudentList.next(newData);
  }

  getProjectID() : String { //returns current projectID
    console.log(this.projectID);
    return this.projectID;
  }

  setProjectID(projectID: String) : void {
    this.projectID = projectID;
  }
}
