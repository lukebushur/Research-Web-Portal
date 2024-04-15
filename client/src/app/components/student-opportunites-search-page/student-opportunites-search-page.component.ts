import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardService } from '../../controllers/student-dashboard-controller/student-dashboard.service';
import { SearchProjectService } from 'src/app/controllers/search-project-controller/search-project.service';
import { SearchOptions } from 'src/app/_models/searchOptions';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-student-opportunites-search-page',
  templateUrl: './student-opportunites-search-page.component.html',
  styleUrls: ['./student-opportunites-search-page.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    NgStyle,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatDividerModule,
    SpinnerComponent,
    ReactiveFormsModule
  ]
})
export class StudentOpportunitesSearchPageComponent {
  constructor(private router: Router, private studentDashboardService: StudentDashboardService, private search: SearchProjectService, private fb: FormBuilder) { }

  // This function is called when the component is loaded
  ngOnInit() {
    this.getStudentInfo();
  }

  // Form for the search bar
  searchForm = this.fb.group({
    projectName: ['', [Validators.required]],
  });

  // Live announcer for screen reader accessibility
  announcer = inject(LiveAnnouncer);

  //these variables will be used to store the request parameters
  GPA: number;
  npp: number = 10; //The number of projects to return per page
  pageNum: number = 1; //The page of search results the user is on currently
  query: string;
  posted: Date;
  deadline: Date;
  majors: string[] = []; //array for the mat chip to store the majors entered by users
  allOpportunities: any[] = [];

  filterGPA: number = 0;
  resultFilterString: string = "";
  allUnChecked: boolean = true;

  gpaPattern = /^[0-3](\.[0-9]{1,2})?$|^4(\.[0]{1,2})?$/;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // Variables
  opportunities: any[] = [];
  //searchQuery: string = ''; // Variable to hold search query
  filteredOpportunities: any[] = [];
  availableMajors: string[] = [];
  selectedMajors: string[] = [];
  studentGPA: number = 0;
  searchfilters: boolean = false;
  resultFilters: boolean = false;
  studentMajors: string[] = [];

  // Functions
  // Search projects
  // This function is called when the search form is submitted
  searchProjects() {
    // Create the search options object
    let searchOpts: SearchOptions = {}

    // Set the search options based on the form values
    searchOpts.deadline = this.deadline ? this.deadline : undefined;
    searchOpts.posted = this.posted ? this.posted : undefined;
    searchOpts.GPA = this.GPA ? this.GPA : undefined;
    searchOpts.majors = this.majors ? this.majors : undefined;
    searchOpts.query = this.searchForm.get('projectName')?.value ?? undefined;

    // Send the search request to the back-end
    this.search.searchProjectsMultipleParams(searchOpts).subscribe({
      next: (data) => {
        console.log(data);
        // Set the opportunities to the search results
        this.allOpportunities = data.success.results;
        this.filteredOpportunities = this.allOpportunities;
        // Reset the page number
        this.opportunities = this.filteredOpportunities.slice(0, this.npp);

        // Get the available majors
        this.availableMajors = [];
        this.allOpportunities.forEach((project: any) => {
          project.majors.forEach((major: any) => {
            // If the major is not already in the availableMajors array, add it
            if (!this.availableMajors.includes(major)) {
              this.availableMajors.push(major);
            }
          });
        });
        // Sort the available majors
        this.availableMajors.sort();
      }
    })
  }

  // Pagination functions
  nextPage() {
    // If there are more opportunities to display, display the next page
    this.opportunities = this.filteredOpportunities.slice(this.npp * this.pageNum, this.npp * (this.pageNum + 1))
    this.pageNum++;
  }

  // Move to the previous page
  prevPage() {
    // If there is a previous page, display it
    this.pageNum--;
    this.opportunities = this.filteredOpportunities.slice(this.npp * (this.pageNum - 1), this.npp * this.pageNum)
  }

  // Check if there is a next page
  hasNextPage() {
    if (this.filteredOpportunities.length > this.npp * this.pageNum) { return true; }
    return false;
  }

  // Check if there is a previous page
  hasPrevPage() {
    if (this.pageNum > 1) { return true; }
    return false;
  }

  // Reset the page number
  resetPage() {
    this.pageNum = 1;
    this.opportunities = this.filteredOpportunities.slice(0, this.npp);
  }

  // Get all opportunities
  // This isn't really used right now but
  // it's here in case we need it later
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

  // Apply to opportunity
  applyToOpportunity(opportunity: any): void {
    // Navigate the student to the apply-to-project page
    this.router.navigate(['/student/apply-to-project'], {
      queryParams: {
        // Pass the professor information and opportunity ID as query parameters
        // to the apply-to-project page
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity._id,
      }
    });
  }

  // Filter opportunities
  filterOpportunities() {
    // Filter opportunities based on search query and selected majors

    // Filter by selected majors
    this.filteredOpportunities = this.allOpportunities.filter(opportunity => {
      return this.checkMajorFilter(opportunity.majors); // Return the result of checkMajorFilter
    });

    // Filter by GPA
    this.filteredOpportunities = this.filteredOpportunities.filter(opportunity => {
      return opportunity.GPA > this.filterGPA;
    });

    // Filter by search query
    this.filteredOpportunities = this.filteredOpportunities.filter(opportunity => {
      // Filter by project name
      const projectNameMatch = opportunity.projectName ?
        opportunity.projectName.toLowerCase().includes(this.resultFilterString.toLowerCase()) : undefined;

      // Filter by professor name and email
      const professorName = opportunity.professorName ?
        opportunity.professorName.toLowerCase().includes(this.resultFilterString.toLowerCase()) : undefined;

      const professorEmail = opportunity.professorEmail ?
        opportunity.professorEmail.toLowerCase().includes(this.resultFilterString.toLowerCase()) : undefined;

      // Filter by categories
      const categoriesMatch = opportunity.categories ?
        opportunity.categories.some((category: any) => category.toLowerCase().includes(this.resultFilterString.toLowerCase())) : undefined;

      // Filter by description
      const descriptionMatch = opportunity.description ?
        opportunity.description.toLowerCase().includes(this.resultFilterString.toLowerCase()) : undefined;

      // Filter by responsibilities
      const responsibilitiesMatch = opportunity.responsibilities ?
        opportunity.responsibilities.toLowerCase().includes(this.resultFilterString.toLowerCase()) : undefined;

      // Filter by selected majors
      const majorsMatch = opportunity.majors ?
        opportunity.majors.some((major: any) => major.toLowerCase().includes(this.resultFilterString.toLowerCase())) : undefined;

      // Return true if any of the fields match the resultFilterString or selected majors
      return projectNameMatch || categoriesMatch || descriptionMatch || responsibilitiesMatch || majorsMatch || professorEmail || professorName;
    });

    // Regenerate the page
    this.resetPage();
  }

  // Check if the opportunity's majors match the selected majors
  checkMajorFilter(majors: string[]): boolean {
    // If no majors are selected, return true to include all opportunities
    if (this.selectedMajors.length === 0) {
      return true;
    }
    // Check if any selected majors match the opportunity's majors
    return majors.some(major => this.selectedMajors.includes(major));
  }

  // called when the search button is clicked
  onSearchButtonClick() {
    // Search for projects
    this.searchProjects();
  }

  // Get the list of possible majors from the back-end
  async getAvailableMajors() {
    // Get the available majors
    const getMajorsPromise = await this.studentDashboardService.getAvailableMajors();
    // Subscribe to the promise
    getMajorsPromise.subscribe({
      next: (data) => {
        // Set the available majors
        this.availableMajors = data.success.majors;
        // and sort them
        this.availableMajors.sort();
      },
      // Log any errors
      error: (error) => {
        console.error('Error getting available majors.', error);
      }
    });
  }

  // View project
  viewProject(project: any) {
    // btoa -> Converts the email to Base64
    // Navigate the student to the view-project page
    this.router.navigate([`/student/view-project/${btoa(project.professorEmail)}/${project._id}`]);
  }

  onCheckboxChange(event: MatSelectChange) {
    // Get the major from the event
    const major = event.source.value;
    // Add or remove the major from the selectedMajors array
    if (event.source.selected) {
      this.selectedMajors.push(major);
    } else {
      // Remove the major from the selectedMajors array
      const index = this.selectedMajors.indexOf(major);
      if (index >= 0) {
        this.selectedMajors.splice(index, 1);
      }
    }
    // Update filtered opportunities when checkboxes change
    this.filterOpportunities();
  }

  // Get student information
  getStudentInfo(): void {
    // Get the student information
    this.studentDashboardService.getStudentInfo().subscribe({
      next: (data: any) => {
        // If the request was successful, set the student's GPA and majors
        if (data.success) {
          // Set the student GPA and majors
          this.studentGPA = data.success.accountData.GPA;
          this.studentMajors = data.success.accountData.Major;
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }

  // Convert date string to a readable format
  dateToString(dateString: string | undefined): string {
    if (!dateString) {
      return 'None';
    }
    // Convert the date to a string
    const date = new Date(dateString);
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', { weekday: undefined, year: 'numeric', month: 'short', day: 'numeric' });
    return dateTimeFormat.format(date);
  }

  // Check if the student meets the requirements
  meetRequirements(opportunity: any): boolean {
    // Check if the student meets the GPA and major requirements
    return ((!opportunity.GPA) || (this.studentGPA >= opportunity.GPA))
      && ((opportunity.majors.length === 0) || (opportunity.majors.some((major: string) => this.studentMajors.includes(major))));
  }

  // Add and remove majors
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.majors.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  // Remove a major
  remove(genre: string): void {
    const index = this.majors.indexOf(genre);

    if (index >= 0) {
      this.majors.splice(index, 1);

      this.announcer.announce(`Removed ${genre}`);
    }
  }

  // Edit a major
  edit(genre: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(genre);
      return;
    }

    // Replace the genre with the edited value
    const index = this.majors.indexOf(genre);
    if (index >= 0) {
      this.majors[index] = value;
    }
  }

  // does this need an explanation?
  isEven(num: number): boolean {
    return num % 2 === 0;
  }

  // re-filter the opportunities when the user types in the search bar
  onTextInputChange() {
    this.filterOpportunities();
  }

  // re-filter the opportunities when the user changes the GPA slider
  onSliderChange() {
    this.filterOpportunities();
  }

  // Reset the filters to default
  resetFilters() {
    this.filteredOpportunities = this.allOpportunities;
    this.filterGPA = 0;
    this.resultFilterString = "";
    this.allUnChecked = true;
    this.selectedMajors = [];
    this.resetPage();
  }

  // Get the selected status of a major
  getSelectedStatus(major: string) {
    if (this.selectedMajors.includes(major)) { return true; }
    return false;
  }
}
