import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectComponent } from './view-project.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { provideRouter } from '@angular/router';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent { }

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
      imports: [
        HttpClientTestingModule,
        SpinnerSubComponent,
        MatTableModule,
        ViewProjectComponent,
      ],
      providers: [provideRouter([])]
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
