import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'student-search-opps',
  templateUrl: './student-search-opps.component.html',
  imports: [CommonModule, MatSidenavModule, FormsModule, MatIconModule, MatCheckboxModule],
  styleUrls: ['./student-search-opps.component.css'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})

export class StudentSearchOppsComponent implements OnInit {
  title = 'studentSearchOpps';

  //For side-nav opening
  opened = false;

  
  @ViewChildren('app-text-field', {read: ViewContainerRef})
  answer!: ViewContainerRef;

  ngOnInit() {

  }

  constructor() {
    //Get opportunities from backend

    // createComponent
    // 

  }


  
  
}
