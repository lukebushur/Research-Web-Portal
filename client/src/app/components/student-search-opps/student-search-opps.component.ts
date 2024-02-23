import { Component, ElementRef, NO_ERRORS_SCHEMA, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {OpportunityComponent} from './opportunity/opportunity.component';
import {MatSliderModule} from '@angular/material/slider';

import { AppRoutingModule } from '../../app-routing.module';

@Component({
  selector: 'student-search-opps',
  templateUrl: './student-search-opps.component.html',
  imports: [CommonModule, MatSidenavModule, FormsModule, MatIconModule, MatCheckboxModule, OpportunityComponent, MatSliderModule],
  styleUrls: ['./student-search-opps.component.css'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})

export class StudentSearchOppsComponent implements OnInit {
  title = 'studentSearchOpps';

  //For side-nav opening
  opened = false;

  //Opportunitiesarray
  // opportunityArray: string[][]=[("OpportunityName","Computer Science", "Dr. Kim"), 
  //                                   ("OpportunityName","Computer Science", "Dr. Kim" )];


  oppArray = JSON.parse('{"_id":{"$oid":"65bb0c8983712d2f51857261"},"type":"Draft","professorEmail":"tess2@gmail.com","professorName":"Test2 Test","projects":[{"projectName":"Test 267001010","GPA":3,"majors":["Computer Science"],"categories":["Computer Science","Mathematics","Biology","Bioinformatics","Computer Science","Biology"],"professorId":{"$oid":"65b328859cdc9e949b083bc3"},"deadline":{"$date":"2024-02-28T05:00:00.000Z"},"description":"Temporary description","questions":[{"question":"Can you eat frogs?","requirementType":"radio button","required":true,"choices":["Yes, I can eat frogs!","No, I cannot eat frogs!","Test 2"]},{"question":"Write a 3-page paper on why baby shark is the best song ever.","requirementType":"text","required":true,"choices":["New Option"]}],"_id":{"$oid":"65bb10c36519f0606e2a18bd"},"applications":[]},{"projectName":"Temporary Title","GPA":3,"majors":["Computer Science","Mathematics","Biology"],"categories":["Bioinformatics","Computer Science","Biology"],"professorId":{"$oid":"65b328859cdc9e949b083bc3"},"deadline":{"$date":"2024-01-18T05:00:00.000Z"},"description":"Temporary description","questions":[{"question":"Can you eat frogs?","requirementType":"radio button","required":true,"choices":["Yes, I can eat frogs!","No, I cannot eat frogs!"]},{"question":"Write a 3-page paper on why baby shark is the best song ever.","requirementType":"text","required":true}],"_id":{"$oid":"65bfc7ad2ced73d76c4ff955"},"applications":[]},{"projectName":"Temporary Title","GPA":3,"majors":["Music","Mathematics","Biology"],"categories":["Bioinformatics","Computer Science","Biology"],"professorId":{"$oid":"65b328859cdc9e949b083bc3"},"deadline":{"$date":"2024-01-18T05:00:00.000Z"},"description":"Temporary description","questions":[{"question":"Can you eat frogs?","requirementType":"radio button","required":true,"choices":["Yes, I can eat frogs!","No, I cannot eat frogs!"]},{"question":"Write a 3-page paper on why baby shark is the best song ever.","requirementType":"text","required":true},{"question":"Frogs?","requirementType":"check box","required":true,"choices":["Frogs","frogs"]}],"_id":{"$oid":"65c18fb279f7c58f83f937d3"},"applications":[{"applicationRecordID":{"$oid":"65c182469135ddb17cbef742"},"application":{"$oid":"65c268d698ad5de4004db263"},"status":"Accept","name":"Test2 Test","GPA":3.5,"major":["Computer Science"],"email":"test12@gmail.com","appliedDate":{"$date":"2024-02-06T17:13:58.527Z"},"_id":{"$oid":"65c268d698ad5de4004db268"}},{"applicationRecordID":{"$oid":"65c2fefbeb7f73af4108c826"},"application":{"$oid":"65c2fefbeb7f73af4108c827"},"status":"Reject","name":"student him","GPA":3.5,"major":["Computer Science","Music"],"email":"studddent@gmail.com","appliedDate":{"$date":"2024-02-07T03:54:35.285Z"},"_id":{"$oid":"65c2fefbeb7f73af4108c829"}},{"applicationRecordID":{"$oid":"65c2ff0feb7f73af4108c852"},"application":{"$oid":"65c2ff0feb7f73af4108c853"},"status":"Accept","name":"Jimothy Jones","GPA":2,"major":["Computer Science","Music"],"email":"stuaadddent@gmail.com","appliedDate":{"$date":"2024-02-07T03:54:55.672Z"},"_id":{"$oid":"65c2ff0feb7f73af4108c855"}},{"applicationRecordID":{"$oid":"65c2ff29eb7f73af4108c882"},"application":{"$oid":"65c2ff29eb7f73af4108c883"},"status":"Accept","name":"Matthew Im","GPA":3.5,"major":["Computer Science","Music"],"email":"sastuaadddent@gmail.com","appliedDate":{"$date":"2024-02-07T03:55:21.698Z"},"_id":{"$oid":"65c2ff29eb7f73af4108c885"}}]},{"projectName":"Temporary Title","GPA":3,"majors":["Computer Science","Mathematics","Biology"],"categories":["Bioinformatics","Computer Science","Biology"],"professorId":{"$oid":"65b328859cdc9e949b083bc3"},"deadline":{"$date":"2024-01-18T05:00:00.000Z"},"description":"Temporary description","questions":[{"question":"Can you eat frogs?","requirementType":"radio button","required":true,"choices":["Yes, I can eat frogs!","No, I cannot eat frogs!"]},{"question":"Write a 3-page paper on why baby shark is the best song ever.","requirementType":"text","required":true},{"question":"Frogs?","requirementType":"check box","required":true,"choices":["Frogs","frogs"]}],"_id":{"$oid":"65c27ecd6334b65754c419c3"},"applications":[]},{"projectName":"Temporary Title","GPA":3,"majors":["Bait","Mathematics","Biology"],"categories":["Bioinformatics","Computer Science","Biology"],"professorId":{"$oid":"65b328859cdc9e949b083bc3"},"deadline":{"$date":"2024-01-18T05:00:00.000Z"},"description":"Temporary description","questions":[{"question":"Can you eat frogs?","requirementType":"radio button","required":true,"choices":["Yes, I can eat frogs!","No, I cannot eat frogs!"]},{"question":"Write a 3-page paper on why baby shark is the best song ever.","requirementType":"text","required":true},{"question":"Frogs?","requirementType":"check box","required":true,"choices":["Frogs","frogs"]}],"_id":{"$oid":"65c27ed96334b65754c419c9"},"applications":[]},{"projectName":"Temporary Title","GPA":3,"majors":["Computer Science","Mathematics","Biology"],"categories":["Bioinformatics","Computer Science","Biology"],"professorId":{"$oid":"65b328859cdc9e949b083bc3"},"deadline":{"$date":"2024-01-18T05:00:00.000Z"},"description":"Temporary description","questions":[{"question":"Can you eat frogs?","requirementType":"radio button","required":true,"choices":["Yes, I can eat frogs!","No, I cannot eat frogs!"]},{"question":"Write a 3-page paper on why baby shark is the best song ever.","requirementType":"text","required":true},{"question":"Frogs?","requirementType":"check box","required":true,"choices":["Frogs","frogs"]}],"_id":{"$oid":"65c282ce659f0d86fcf763e8"},"applications":[]},{"projectName":"Temp","GPA":3,"majors":["Computer Science"],"categories":["Bioinformatics","Computer Science","Biology"],"posted":{"$date":"2024-02-14T02:14:05.878Z"},"deadline":{"$date":"2024-01-18T05:00:00.000Z"},"description":"Test","questions":[{"question":"Can you eat frogs?","requirementType":"radio button","required":true,"choices":["Yes, I can eat frogs!","No, I cannot eat frogs!"]},{"question":"Write a 3-page paper on why baby shark is the best song ever.","requirementType":"text","required":true},{"question":"Frogs?","requirementType":"check box","required":true,"choices":["Frogs","frogs"]}],"_id":{"$oid":"65cc21ed3c8008263af56003"},"applications":[]}],"__v":1}');

  oppName: string[];
  
  @ViewChildren('app-text-field', {read: ViewContainerRef})
  answer!: ViewContainerRef;

  ngOnInit() {
    for (var opp of this.oppArray) {
      this.oppName.push(opp.projects.projectName);
    } 
  }

  constructor(private router: Router) { 

   }  
 

  //Slider
  formatLabel(value: number): string {
    if (value >= 4.0) {
      return '4.0';
    }
    if (value <= 0.0) {
      return '0.0';
    }

    return `${value}`;
  }
  

}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

