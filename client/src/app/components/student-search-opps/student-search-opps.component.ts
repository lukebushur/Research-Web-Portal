import { Component, ElementRef, NO_ERRORS_SCHEMA, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule, getLocaleDateFormat, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {OpportunityComponent} from './opportunity/opportunity.component';
import {MatSliderModule} from '@angular/material/slider';
import { SearchProjectService } from '../../controllers/search-project-controller/search-project.service';
import { SearchOptions } from 'src/app/_models/searchOptions';

import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppRoutingModule } from '../../app-routing.module';
import { StudentDashboardService } from '../../controllers/student-dashboard-controller/student-dashboard.service';
import { query } from '@angular/animations';


@Component({
  selector: 'app-student-search-opps',
  templateUrl: './student-search-opps.component.html',
  styleUrls: ['./student-search-opps.component.css'],
  imports: [CommonModule, MatSidenavModule, MatIconModule, MatCheckboxModule, MatSliderModule, FormsModule, NgFor],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})

export class StudentSearchOppsComponent implements OnInit {

  majors = new FormControl('');
  majorList: string[] = ['Computer Science', 'Mathematics', 'Biology', 'Psychology', 'History', 'Elvish'];

  title = 'studentSearchOpps';

  opportunities: any[] = [];
  searchQuery: string = ''; // Variable to hold search query
  filteredOpportunities: any[] = [];
  searchedOpps: any[] = [];
  availableMajors: string[] = [];
  selectedMajors: string[] = [];
  studentGPA: number = 0;
  studentMajors: string[] = [];

  //SearchOptions object
  searchOptions: SearchOptions = {
    query: "",
    majors: [],
    GPA: 3.0,
    npp: 0,
    pageNum: 1,
  }; 


  @ViewChildren('app-text-field', {read: ViewContainerRef})
  answer!: ViewContainerRef;

  ngOnInit() {
      this.searchOptions.query = "";
      this.getAllOpportunities();
      this.getStudentInfo();
    } 

  constructor(private router: Router, private searchservice: SearchProjectService, private studentDashboardService: StudentDashboardService) { 
    this.searchedOpps = this.opportunities;
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

  getAllOpportunities() {
    this.searchservice.searchProjectsSingleParams("").subscribe({
      next: (data: any) => {
        //this.opportunities = data.success.results;
        console.log("1"); 
      },
      // error: (error: any) => {
      //   console.error('Error getting opportunities', error);
      // }
    });
  }

  applyToOpportunity(opportunity: any): void {
    this.router.navigate(['/apply-to-post'], {
      queryParams: {
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity.projectID,
      }
    });
  }   

  searchOpps(searchString: string) {
    //Search for opportunities
    this.searchOptions.query = searchString;
  }
  
  meetRequirements(opportunity: any): boolean {
    return ((!opportunity.GPA) || (this.studentGPA >= opportunity.GPA))
      && ((opportunity.majors.length === 0) || (opportunity.majors.some((major: string) => this.studentMajors.includes(major))));
  }

  getStudentInfo(): void {
    this.studentDashboardService.getStudentInfo().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.studentGPA = data.success.accountData.GPA;
          this.studentMajors = data.success.accountData.Major;
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }

}

function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}



