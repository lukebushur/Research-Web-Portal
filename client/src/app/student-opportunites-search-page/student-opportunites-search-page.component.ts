import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardService } from '../controllers/student-dashboard-controller/student-dashboard.service';

@Component({
  selector: 'app-student-opportunites-search-page',
  templateUrl: './student-opportunites-search-page.component.html',
  styleUrls: ['./student-opportunites-search-page.component.css']
})
export class StudentOpportunitesSearchPageComponent {
  constructor(private router: Router, private studentDashboardService: StudentDashboardService) {}

  ngOnInit() {
    this.getAllOpportunities();
    this.getAvailableMajors();
    console.log(this.availableMajors);

  }

  opportunities: any[] = [];
  searchQuery: string = ''; // Variable to hold search query
  filteredOpportunities: any[] = [];
  availableMajors: string[] = [];
  selectedMajors: string[] = [];

  getAllOpportunities() {
    this.studentDashboardService.getOpportunities().subscribe({
      next: (data) => {
        this.opportunities = data.success.data;

        // Filter opportunities initially
        this.filterOpportunities();
      },
      error: (error) => {
        console.error('Error getting opportunities', error);
      }
    });
  }

  filterOpportunities() {
    // Filter opportunities based on search query
    this.filteredOpportunities = this.opportunities.filter(opportunity => {
      return opportunity.title.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

    //clear the search bar after clicking the search button or hitting enter
    this.searchQuery = '';
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterOpportunities();
    }
  }

  onSearchButtonClick() {
    this.filterOpportunities();
  }

  getAvailableMajors() {
    this.studentDashboardService.getAvailableMajors().subscribe({
      next: (data) => {
        this.availableMajors = data.success.majors;
      },
      error: (error) => {
        console.error('Error getting available majors.', error);
      }
    })
  }

}
