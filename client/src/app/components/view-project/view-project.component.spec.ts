import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectComponent } from './view-project.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProjectData } from 'src/app/_models/apply-to-post/projectData';
import { QuestionData } from 'src/app/_models/apply-to-post/questionData';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { FactoryTarget } from '@angular/compiler';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/controllers/auth-controller/auth.service';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent {}

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
    message: "PROJECT_FOUND",
    project: testProjectData
  }
};
const getStudentInfoResponse = {
  success: {
    status: 200,
    message: "ACCOUNT_FOUND",
    accountData: {
      email: "test@email.com",
      name: "Test Test",
      universityLocation: "Purdue University Fort Wayne",
      emailConfirmed: true,
      userType: environment.facultyType,
      GPA: 3.0,
      Major: [
        "Major 1",
        "Major 2"
      ]
    }
  }
}
const applicantResponse = {
  "success": {
      "status": 200,
      "message": "APPLICANTS_FOUND",
      "applicants": [
          {
              "questions": [
                  {
                      "question": "Yes or no?",
                      "requirementType": "check box",
                      "required": true,
                      "choices": [
                          "large",
                          "man",
                          "response"
                      ],
                      "answers": [
                          "man"
                      ]
                  },
                  {
                      "question": "Why do you want this?",
                      "requirementType": "text",
                      "required": true,
                      "answers": [
                          "Piece national individual act other who. Play story citizen hit. Instead natural minute thank."
                      ]
                  },
                  {
                      "question": "What can you do?",
                      "requirementType": "text",
                      "required": true,
                      "answers": [
                          "Treat eight door central treatment drive. Foreign baby article claim."
                      ]
                  },
                  {
                      "question": "Foo or Fee?",
                      "requirementType": "radio button",
                      "required": true,
                      "choices": [
                          "Laugh serious whose view over trade PM room.",
                          "Themselves dark experience every difficult may."
                      ],
                      "answers": [
                          "Laugh serious whose view over trade PM room."
                      ]
                  },
                  {
                      "question": "Random choice?",
                      "requirementType": "radio button",
                      "required": true,
                      "choices": [
                          "Mrs boy form myself.",
                          "Environment friend anyone account situation."
                      ],
                      "answers": [
                          "Environment friend anyone account situation."
                      ]
                  }
              ],
              "status": "Pending",
              "GPA": 3.65,
              "name": "Erik Singh",
              "majors": [
                  "Political Science",
                  "Women's Studies"
              ],
              "appliedDate": "2024-03-20T23:09:42.313Z",
              "location": "Purdue University Fort Wayne",
              "application": "65fba4f618f3bec8d5807afd"
          },
      ]
  }
}

describe('ViewProjectComponent', () => {
  let component: ViewProjectComponent;
  let fixture: ComponentFixture<ViewProjectComponent>;

  let getAuthSpy: jasmine.Spy;
  let getDetailedApplicants: jasmine.Spy;
  let getProjectInfo: jasmine.Spy;

  const authService = jasmine.createSpyObj('AuthService', ['getAccountInfo']);
  getAuthSpy = authService.getAccountInfo.and.returnValue(of({success: {accountData: {userType: environment.facultyType}}}));

  const facultyProjects = jasmine.createSpyObj('FacultyProjectService', ['getProject', 'detailedFetchApplicants', 'applicationDecide'])
  getProjectInfo = facultyProjects.getProject.and.returnValue(of(getProjectInfoResponse));
  getDetailedApplicants = facultyProjects.detailedFetchApplicants.and.returnValue(of(applicantResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProjectComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SpinnerSubComponent,
        MatTableModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              projectID: testProjectData.projectID,
              professorEmail: btoa(testProjectData.professorEmail),
              projectType: 'active'
            }),
          },
        },
        {
            provide: FacultyProjectService,
            useValue: facultyProjects
        },
        {
            provide: AuthService,
            useValue: authService
        }
      ]
    });
    fixture = TestBed.createComponent(ViewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
//   it('should fetch account type', () => {
//     expect(getAuthSpy).withContext('getAccountInfo() called').toHaveBeenCalled();
//   })

//   it('should fetch the project', async () => {
//     await fixture.whenStable();
//     expect(getProjectInfo).withContext('getProjectInfo() called with').toHaveBeenCalledWith(testProjectData.projectID, 'active')
//   })

//   it('should fetch applicants as faculty', () => {

//   })

});
