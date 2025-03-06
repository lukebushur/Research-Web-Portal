import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentOpportunitesSearchPageComponent } from './student-opportunites-search-page.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDa
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { SearchProjectService } from 'app/controllers/search-project-controller/search-project.service';

import { StudentDashboardService } from 'app/controllers/student-dashboard-controller/student-dashboard.service';
import { Router } from '@angular/router';
import { QuestionData } from 'app/_models/projects/questionData';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Mock question data
const testQuestionData: QuestionData[] = [
  {
    question: 'Choose any of the following.',
    requirementType: 'check box',
    required: true,
    choices: ['item1', 'item2', 'item3'],
  },
  {
    question: 'Which one is correct?',
    requirementType: 'radio button',
    required: true,
    choices: ['option1', 'option2', 'option3'],
  },
  {
    question: 'Please describe your details.',
    requirementType: 'text',
    required: true,
  },
];
// Mock project data
const testProjectData = {
  professorName: 'Test Professor',
  professorEmail: 'testemail@email.com',
  _id: '123',
  projectName: 'Test Project',
  description: 'This project is for testing.',
  categories: ['Technology', 'Documentation', 'Writing'],
  GPA: 2.0,
  majors: ['Computer Science', 'Theatre'],
  posted: 'Fri Feb 16 2024',
  deadline: 'Sun Mar 17 2024',
  questions: testQuestionData,
};
// Mock responses
const getProjectInfoResponse = {
  success: {
    status: 200,
    message: "PROJECTS_FOUND",
    data: [
      testProjectData
    ]
  }
};
// Mock search response
const testSearchResponse = {
  success: {
    status: 200,
    message: "PROJECTS_FOUND",
    results: [
      testProjectData
    ]
  }
}

// Mock student info response
const getStudentInfoResponse = {
  success: {
    status: 200,
    message: "ACCOUNT_FOUND",
    accountData: {
      email: "test@email.com",
      name: "Test Test",
      universityLocation: "Purdue University Fort Wayne",
      emailConfirmed: true,
      GPA: 3.0,
      Major: [
        "Major 1",
        "Computer Science"
      ]
    }
  }
}
// Define a spinner subcomponent
@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

// Define the tests
describe('StudentOpportunitesSearchPageComponent', () => {
  let component: StudentOpportunitesSearchPageComponent;
  let fixture: ComponentFixture<StudentOpportunitesSearchPageComponent>;

  // Define spy objects for SearchProjects
  let searchSpy: jasmine.Spy;

  // Define spy objects for StudentDashboardService
  const searchProjects = jasmine.createSpyObj('SearchProjectService', ['searchProjectsMultipleParams'])
  searchSpy = searchProjects.searchProjectsMultipleParams.and.returnValue(of(testSearchResponse));

  // Define spy objects for StudentDashboardService
  const studentDashboardService = jasmine.createSpyObj('StudentDashboardService', ['getOpportunities', 'getStudentInfo'])
  studentDashboardService.getOpportunities.and.returnValue(of(getProjectInfoResponse));;
  studentDashboardService.getStudentInfo.and.returnValue(of(getStudentInfoResponse));

  // Define spy objects for Router
  const router = jasmine.createSpyObj('Router', ['navigate']);
  let routerSpy = router.navigate.and.returnValue(Promise.resolve(true));

  // Set up the test bed
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
        CdkAccordionModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        StudentOpportunitesSearchPageComponent,
        SpinnerSubComponent
      ],
      providers: [
        // Provide the search project service
        { provide: SearchProjectService, useValue: searchProjects },
        // Provide the student dashboard service
        { provide: StudentDashboardService, useValue: studentDashboardService },
        // Provide the router
        { provide: Router, useValue: router },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    // Create the component
    fixture = TestBed.createComponent(StudentOpportunitesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test for the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test for the searchProjects function
  it('should call searchProjectsMultipleParams', () => {
    if (component.searchForm) {
      component.searchForm.get("projectName")?.setValue('Test Project');
    }
    // Reset the spy
    searchProjects.searchProjectsMultipleParams.calls.reset();
    component.searchProjects();
    // Check that the function was called with the correct parameters
    expect(searchSpy).toHaveBeenCalledOnceWith({
      deadline: undefined,
      posted: undefined,
      GPA: undefined,
      majors: [],
      query: 'Test Project'
    });
  })

  // Test generation of project data
  it('should generate a project from example data', () => {
    component.searchProjects();
    // Check that the project was generated
    // and that the project data exists
    expect(component.opportunities.length).toBe(1);
    expect(component.opportunities[0]).toBeTruthy();
  })

  // Test for the project card
  it('should generate a project card in html', () => {
    component.searchProjects();
    fixture.detectChanges();
    // Check that the project card was generated
    const cardDebugElement = fixture.debugElement.query(debugEl =>
      // Check if the classes is "opportunities-container"
      debugEl.classes['opportunities-container']
    );
    // Check that the card exists
    expect(cardDebugElement).toBeTruthy();
  })

  // clicking apply should redirect you like the student dashboard
  it('should navigate you to apply', async () => {
    // Search for projects
    await component.searchProjects();
    // Trigger a change detection
    fixture.detectChanges();
    // Find the button we want
    const buttonDebugElement = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent.trim() === 'APPLY'
    )
    // Click the button
    buttonDebugElement.triggerEventHandler('click', null)
    // Check that the function was called with the correct parameters
    expect(routerSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/apply-to-project'], {
      queryParams: {
        // Pass the opportunity information to the apply-to-project page
        profName: testProjectData.professorName,
        profEmail: testProjectData.professorEmail,
        oppId: testProjectData._id,
      }
    });
  })

  it('should provide filter opportunities by some example searches', () => {
    // Search for projects
    component.searchProjects();
    fixture.detectChanges();

    // Test GPA
    component.filterGPA = 4;
    component.filterOpportunities();
    // Check that the opportunities are empty
    expect(component.opportunities.length).withContext('should be empty').toBe(0);
    component.filterGPA = 0;
    // Reset the filter
    component.filterOpportunities();
    fixture.detectChanges();
    // Check that the opportunities are not empty
    expect(component.opportunities.length).withContext('shouldn\'t be empty').toBe(1);

    // Test Name
    component.resultFilterString = "This should be empty now"
    component.filterOpportunities();
    // Check that the opportunities are empty
    expect(component.opportunities.length).withContext('should be empty').toBe(0);
    component.resultFilterString = ""
    // Reset the filter and check that the opportunities are not empty
    component.filterOpportunities();
    fixture.detectChanges();
    // Should not be empty now since it should
    expect(component.opportunities.length).withContext('shouldn\'t be empty').toBe(1);

  })

});
