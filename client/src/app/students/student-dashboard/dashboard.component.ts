import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardService } from 'app/controllers/student-dashboard-controller/student-dashboard.service';
import { DateConverterService } from 'app/controllers/date-converter-controller/date-converter.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SearchProjectService } from 'app/controllers/search-project-controller/search-project.service';
import { SearchOptions } from '../models/searchOptions';

@Component({
  selector: 'student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatDividerModule,
    SpinnerComponent,
  ]
})
export class StudentDashboard {

  constructor(
    private router: Router,
    private studentDashboardService: StudentDashboardService,
    private dateService: DateConverterService,
    private search: SearchProjectService
  ) { }

  // This function is called when the component is loaded
  ngOnInit() {
    this.getStudentInfo();
  }

  majorOpportunities: {
    [major: string]: {
      opps: any[],
      pageNum: number,
    }
  } = {};
  majors: string[] = [];
  studentGPA: number = 0;
  studentMajors: string[] = [];
  allOpportunities: [] = [];
  filteredMajorOpps: { [major: string]: any[] } = {};

  // page index
  pageNum: number = 1;
  npp: number = 6;

  getAllOpportunities() {
    let searchOpts: SearchOptions = {}

    searchOpts.majors = this.studentMajors ? this.studentMajors : undefined;

    this.search.searchProjectsMultipleParams(searchOpts).subscribe({
      next: (data) => {
        const opportunities = data.success.results;

        // Group opportunities by major
        opportunities.forEach((opportunity: { majors: string[]; }) => {
          opportunity.majors.forEach((major: string) => {
            // If the major does not exist in the majorOpportunities object, then add it
            if (!this.majorOpportunities[major]) {
              this.majorOpportunities[major] = { opps: [], pageNum: 1 }
              this.majors.push(major);
            }
            this.majorOpportunities[major].opps.push(opportunity);
            this.resetPage(major);
          });
        });

        // console.log(this.majorOpportunities);
        // console.log(this.majors);
      },
      error: (error) => {
        console.error('Error getting opportunities', error);
      }
    });
  }

  // Apply to opportunity
  // This function is called when the student clicks on the apply button
  applyToOpportunity(opportunity: any): void {
    // Navigate the student to the apply-to-project page
    this.router.navigate(['/student/apply-to-project'], {
      queryParams: {
        // Pass the opportunity information to the apply-to-project page
        profName: opportunity.professorName,
        profEmail: opportunity.professorEmail,
        oppId: opportunity._id,
      }
    });
  }

  // Search opportunities
  searchOpportunities() {
    // Navigate the student to the search-projects page
    this.router.navigate(['/student/search-projects']);
  }

  // Get student applications
  getStudentApplications() {
    // Navigate the student to the applications-overview page
    this.router.navigate(['/student/applications-overview']);
  }

  // View project
  viewProject(project: any) {
    // Navigate the student to the view-project page
    this.router.navigate([`/student/view-project/${project.professorEmail}/${project._id}`]);
  }

  // Get student information
  getStudentInfo(): void {
    // Get the student information
    this.studentDashboardService.getStudentInfo().subscribe({
      next: (data: any) => {
        if (data.success) {
          // Set the student GPA and majors
          this.studentGPA = data.success.accountData.GPA;
          this.studentMajors = data.success.accountData.Major || [];
          // Reset the majors pages now
          this.getAllOpportunities();
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }

  // Check if the student meets the requirements
  meetRequirements(opportunity: any): boolean {
    return ((!opportunity.GPA) || (this.studentGPA >= opportunity.GPA))
      && ((opportunity.majors.length === 0) ||
        // Sometimes the Majors object comes back empty, so for testing reasons we should skip
        // This step if there are no majors currently
        (this.studentMajors.length > 0 && opportunity.majors.some((major: string) => this.studentMajors.includes(major))));
  }

  // Convert date to string
  dateToString(dateString: string | undefined): string {
    if (!dateString) {
      return 'None';
    }
    // Convert the date to a string
    const date = new Date(dateString);
    // Format the date
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', { weekday: undefined, year: 'numeric', month: 'short', day: 'numeric' });
    return dateTimeFormat.format(date);
  }

  nextPage(major: string) {
    this.majorOpportunities[major].pageNum += 1;
    const pageNum = this.majorOpportunities[major].pageNum;
    this.filteredMajorOpps[major] = this.majorOpportunities[major].opps.slice(this.npp * pageNum, this.npp * (pageNum + 1))
  }

  prevPage(major: string) {
    this.majorOpportunities[major].pageNum--;
    const pageNum = this.majorOpportunities[major].pageNum;
    this.filteredMajorOpps[major] = this.majorOpportunities[major].opps.slice(this.npp * (pageNum - 1), this.npp * pageNum)
  }

  hasNextPage(major: string) {
    if (this.majorOpportunities[major] === undefined) { return false; }
    if (this.majorOpportunities[major].opps.length > this.npp * this.majorOpportunities[major].pageNum) { return true; }
    return false;
  }

  getPageNum(major: string) {
    if (!this.majorOpportunities[major]) { return 1; }
    return this.majorOpportunities[major].pageNum;
  }

  hasPrevPage(major: string) {
    if (!this.majorOpportunities[major]) { return false; }
    if (this.majorOpportunities[major].pageNum > 1) { return true; }
    return false;
  }

  resetPage(major: string) {
    if (!this.majorOpportunities[major]) { return; }
    this.majorOpportunities[major].pageNum = 1;
    this.filteredMajorOpps[major] = this.majorOpportunities[major].opps.slice(0, this.npp);
  }
}
