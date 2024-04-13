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

  ngOnInit() {
    this.getStudentInfo();
  }

  searchForm = this.fb.group({
    projectName: ['', [Validators.required]],
  });

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

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  opportunities: any[] = [];
  //searchQuery: string = ''; // Variable to hold search query
  filteredOpportunities: any[] = [];
  availableMajors: string[] = [];
  selectedMajors: string[] = [];
  studentGPA: number = 0;
  searchfilters: boolean = false;
  resultFilters: boolean = false;
  studentMajors: string[] = [];

  searchProjects() {
    let searchOpts: SearchOptions = {}

    searchOpts.deadline = this.deadline ? this.deadline : undefined;
    searchOpts.posted = this.posted ? this.posted : undefined;
    searchOpts.GPA = this.GPA ? this.GPA : undefined;
    searchOpts.majors = this.majors ? this.majors : undefined;
    searchOpts.query = this.searchForm.get('projectName')?.value ?? undefined;

    this.search.searchProjectsMultipleParams(searchOpts).subscribe({
      next: (data) => {
        console.log(data);
        this.allOpportunities = data.success.results;
        this.filteredOpportunities = this.allOpportunities;
        this.opportunities = this.filteredOpportunities.slice(0, this.npp);

        this.availableMajors = [];
        this.allOpportunities.forEach((project: any) => {
          project.majors.forEach((major: any) => {
            if (!this.availableMajors.includes(major)) {
              this.availableMajors.push(major);
            }
          });
        });
        this.availableMajors.sort();
      }
    })
  }

  nextPage() {
    this.opportunities = this.filteredOpportunities.slice(this.npp * this.pageNum, this.npp * (this.pageNum + 1))
    this.pageNum++;
  }

  prevPage() {
    this.pageNum--;
    this.opportunities = this.filteredOpportunities.slice(this.npp * (this.pageNum - 1), this.npp * this.pageNum)
  }

  hasNextPage() {
    if (this.filteredOpportunities.length > this.npp * this.pageNum) { return true; }
    return false;
  }

  hasPrevPage() {
    if (this.pageNum > 1) { return true; }
    return false;
  }

  resetPage() {
    this.pageNum = 1;
    this.opportunities = this.filteredOpportunities.slice(0, this.npp);
  }

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
    this.router.navigate(['/student/apply-to-project'], {
      queryParams: {
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity.projectID,
      }
    });
  }

  filterOpportunities() {
    // Filter opportunities based on search query and selected majors

    this.filteredOpportunities = this.allOpportunities.filter(opportunity => {
      return this.checkMajorFilter(opportunity.majors); // Return the result of checkMajorFilter
    });

    this.filteredOpportunities = this.filteredOpportunities.filter(opportunity => {
      return opportunity.GPA > this.filterGPA;
    });

    this.filteredOpportunities = this.filteredOpportunities.filter(opportunity => {
      // Filter by project name
      const projectNameMatch = opportunity.projectName ?
        opportunity.projectName.toLowerCase().includes(this.resultFilterString.toLowerCase()) : undefined;

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

    this.resetPage();
  }

  checkMajorFilter(majors: string[]): boolean {
    // If no majors are selected, return true to include all opportunities
    if (this.selectedMajors.length === 0) {
      return true;
    }
    // Check if any selected majors match the opportunity's majors
    return majors.some(major => this.selectedMajors.includes(major));
  }

  onSearchButtonClick() {
    this.searchProjects();
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

  viewProject(project: any) {
    // btoa -> Converts the email to Base64
    // Navigate the student to the view-project page
    this.router.navigate([`/student/view-project/${btoa(project.professorEmail)}/${project._id}`]);
  }

  onCheckboxChange(event: MatSelectChange) {
    const major = event.source.value;
    if (event.source.selected) {
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

  dateToString(dateString: string | undefined): string {
    if (!dateString) {
      return 'None';
    }
    const date = new Date(dateString);
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', { weekday: undefined, year: 'numeric', month: 'short', day: 'numeric' });
    return dateTimeFormat.format(date);
  }

  meetRequirements(opportunity: any): boolean {
    return ((!opportunity.GPA) || (this.studentGPA >= opportunity.GPA))
      && ((opportunity.majors.length === 0) || (opportunity.majors.some((major: string) => this.studentMajors.includes(major))));
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.majors.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(genre: string): void {
    const index = this.majors.indexOf(genre);

    if (index >= 0) {
      this.majors.splice(index, 1);

      this.announcer.announce(`Removed ${genre}`);
    }
  }

  edit(genre: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(genre);
      return;
    }

    const index = this.majors.indexOf(genre);
    if (index >= 0) {
      this.majors[index] = value;
    }
  }

  isEven(num: number): boolean {
    return num % 2 === 0;
  }

  onTextInputChange() {
    this.filterOpportunities();
  }

  onSliderChange() {
    this.filterOpportunities();
  }

  resetFilters() {
    this.filteredOpportunities = this.allOpportunities;
    this.filterGPA = 0;
    this.resultFilterString = "";
    this.allUnChecked = true;
    this.selectedMajors = [];
    this.resetPage();
  }

  getSelectedStatus(major: string) {
    if (this.selectedMajors.includes(major)) { return true; }
    return false;
  }
}
