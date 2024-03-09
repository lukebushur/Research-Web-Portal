import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardService } from '../../controllers/student-dashboard-controller/student-dashboard.service';

@Component({
  selector: 'app-student-opportunites-search-page',
  templateUrl: './student-opportunites-search-page.component.html',
  styleUrls: ['./student-opportunites-search-page.component.css']
})
export class StudentOpportunitesSearchPageComponent {
  constructor(private router: Router, private studentDashboardService: StudentDashboardService) { }

  ngOnInit() {
    this.getAllOpportunities();
    this.getAvailableMajors();
    this.getStudentInfo();
  }

  opportunities: any[] = [];
  searchQuery: string = ''; // Variable to hold search query
  filteredOpportunities: any[] = [];
  availableMajors: string[] = [];
  selectedMajors: string[] = [];
  studentGPA: number = 0;
  panelOpenState: boolean = true;
  studentMajors: string[] = [];

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

  applyToOpportunity(opportunity: any): void {
    this.router.navigate(['/apply-to-post'], {
      queryParams: {
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity.projectID,
      }
    });
  }

  filterOpportunities() {
    // Filter opportunities based on search query and selected majors
    this.filteredOpportunities = this.opportunities.filter(opportunity => {
      return opportunity.title.toLowerCase().includes(this.searchQuery.toLowerCase()) && this.checkMajorFilter(opportunity.majors);
    });
  }

  checkMajorFilter(majors: string[]): boolean {
    // If no majors are selected, return true to include all opportunities
    if (this.selectedMajors.length === 0) {
      return true;
    }
    // Check if any selected majors match the opportunity's majors
    return majors.some(major => this.selectedMajors.includes(major));
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterOpportunities();
    }
  }

  onSearchButtonClick() {
    this.filterOpportunities();
  }

  // Get the list of possible majors from the back-end
  async getAvailableMajors() {
    const getMajorsPromise = await this.studentDashboardService.getAvailableMajors();
    getMajorsPromise.subscribe({
      next: (data) => {
        this.availableMajors = data.success.majors;
        this.availableMajors.sort();
      },
      error: (error) => {
        console.error('Error getting available majors.', error);
      }
    });
  }

  onCheckboxChange(major: string, isChecked: boolean) {
    // Update the selectedMajors array based on checkbox changes
    if (isChecked) {
      this.selectedMajors.push(major);
    } else {
      const index = this.selectedMajors.indexOf(major);
      if (index >= 0) {
        this.selectedMajors.splice(index, 1);
      }
    }
    // Update filtered opportunities when checkboxes change
    this.filterOpportunities();
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

  meetRequirements(opportunity: any): boolean {
    return ((!opportunity.GPA) || (this.studentGPA >= opportunity.GPA))
      && ((opportunity.majors.length === 0) || (opportunity.majors.some((major: string) => this.studentMajors.includes(major))));
  }
}
