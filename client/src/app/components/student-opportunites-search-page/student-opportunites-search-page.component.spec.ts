import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentOpportunitesSearchPageComponent } from './student-opportunites-search-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { SearchProjectService } from 'src/app/controllers/search-project-controller/search-project.service';

import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { Router } from '@angular/router';
import { QuestionData } from 'src/app/_models/projects/questionData';
import { ProjectData } from 'src/app/_models/projects/projectData';


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
const testProjectData: ProjectData = {
  professorName: 'Test Professor',
  professorEmail: 'testemail@email.com',
  projectID: '123',
  projectName: 'Test Project',
  description: 'This project is for testing.',
  categories: ['Technology', 'Documentation', 'Writing'],
  GPA: 2.0,
  majors: ['Computer Science', 'Theatre'],
  posted: 'Fri Feb 16 2024',
  deadline: 'Sun Mar 17 2024',
  questions: testQuestionData,
};
const getProjectInfoResponse = {
  success: {
    status: 200,
    message: "PROJECTS_FOUND",
    data: [
      testProjectData
    ]
  }
};
const testSearchResponse = {
  success: {
    status: 200,
    message: "PROJECTS_FOUND",
    results: [
      testProjectData
    ]
  }
}
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

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent {}

describe('StudentOpportunitesSearchPageComponent', () => {
  let component: StudentOpportunitesSearchPageComponent;
  let fixture: ComponentFixture<StudentOpportunitesSearchPageComponent>;

  // Define spy objects for SearchProjects
  let searchSpy: jasmine.Spy;

  const searchProjects = jasmine.createSpyObj('SearchProjectService', ['searchProjectsMultipleParams'])
  searchSpy = searchProjects.searchProjectsMultipleParams.and.returnValue(of(testSearchResponse));

  const studentDashboardService = jasmine.createSpyObj('StudentDashboardService', ['getOpportunities', 'getStudentInfo'])
  let getOpportunitiesSpy = studentDashboardService.getOpportunities.and.returnValue(of(getProjectInfoResponse));;
  let getStudentInfoSpy = studentDashboardService.getStudentInfo.and.returnValue(of(getStudentInfoResponse));

  const router = jasmine.createSpyObj('Router', ['navigate']);
  let routerSpy = router.navigate.and.returnValue(Promise.resolve(true));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
        { provide: SearchProjectService, useValue: searchProjects },
        { provide: StudentDashboardService, useValue: studentDashboardService },
        { provide: Router, useValue: router }
      ]
    });
    fixture = TestBed.createComponent(StudentOpportunitesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchProjectsMultipleParams', () => {
    if (component.searchForm) {
      component.searchForm.get("projectName")?.setValue('Test Project');
    }
    searchProjects.searchProjectsMultipleParams.calls.reset();
    component.searchProjects();
    expect(searchSpy).toHaveBeenCalledOnceWith({
      deadline: undefined,
      posted: undefined,
      GPA: undefined,
      majors: [],
      query: 'Test Project'
    });
  })

  it('should generate a project from example data', () => {
    component.searchProjects();
    expect(component.opportunities.length).toBe(1);
    expect(component.opportunities[0]).toBeTruthy();
  })

  it('should generate a project card in html', () => {
    component.searchProjects();
    fixture.detectChanges();
    const cardDebugElement = fixture.debugElement.query(debugEl => 
      // Check if the classes is "opportunities-container"
      debugEl.classes['opportunities-container']
    );
    expect(cardDebugElement).toBeTruthy();
  })

  // clicking apply should redirect you like the student dashboard
  it('should navigate you to apply', async () => {
    await component.searchProjects();
    fixture.detectChanges();
    const buttonDebugElement = fixture.debugElement.query(
      debugEl => debugEl.name === 'button' && debugEl.nativeElement.textContent.trim() === 'APPLY'
    )
    buttonDebugElement.triggerEventHandler('click', null)
    expect(routerSpy).withContext('navigate called').toHaveBeenCalledOnceWith(['/student/apply-to-project'], {
      queryParams: {
        profName: testProjectData.professorName,
        profEmail: testProjectData.professorEmail,
        oppId: testProjectData.projectID,
      }
    });
  })

  it('should provide filter opportunities by some example searches', () => {

    component.searchProjects();
    fixture.detectChanges();

    // Test GPA
    component.filterGPA = 4;
    component.filterOpportunities();
    expect(component.opportunities.length).withContext('should be empty').toBe(0);
    component.filterGPA = 0;
    component.filterOpportunities();
    fixture.detectChanges();
    expect(component.opportunities.length).withContext('shouldn\'t be empty').toBe(1);

    // Test Name 
    component.resultFilterString = "This should be empty now"
    component.filterOpportunities();
    expect(component.opportunities.length).withContext('should be empty').toBe(0);
    component.resultFilterString = ""
    component.filterOpportunities();
    fixture.detectChanges();
    expect(component.opportunities.length).withContext('shouldn\'t be empty').toBe(1);

  })

});
