import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ResearchProjectCardComponent } from './research-project-card.component';
import { Router, provideRouter } from '@angular/router';
import { ProjectFetchData } from '../models/projectFetchData';
import { Application } from 'app/shared/models/application';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { FacultyService } from '../faculty-service/faculty.service';
import { of } from 'rxjs';
import { MatCardHarness } from '@angular/material/card/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ResearchProjectCardComponent', () => {
  let component: ResearchProjectCardComponent;
  let fixture: ComponentFixture<ResearchProjectCardComponent>;
  let router: Router;
  let facultyService: jasmine.SpyObj<FacultyService>;
  let loader: HarnessLoader;
  const applicationsData: Application[] = [
    {
      _id: '1',
      application: '11',
      applicationRecordID: '111',
      appliedDate: new Date(),
      email: 'name1@email.com',
      GPA: 2.0,
      location: 'Purdue University Fort Wayne',
      major: [
        'Computer Science',
        'Music',
        'Information Technology',
      ],
      name: 'Name 1',
      status: 'Pending'
    },
    {
      _id: '2',
      application: '22',
      applicationRecordID: '222',
      appliedDate: new Date(2024, 2, 30),
      email: 'name2@email.com',
      GPA: 3.2,
      location: 'Purdue University Fort Wayne',
      major: [
        'Computer Science',
      ],
      name: 'Name 2',
      status: 'Accept'
    },
    {
      _id: '3',
      application: '33',
      applicationRecordID: '333',
      appliedDate: new Date(2024, 1, 14),
      email: 'name3@email.com',
      GPA: 4.0,
      location: 'Purdue University Fort Wayne',
      major: [
        'Computer Science',
        'Mathematics'
      ],
      name: 'Name 3',
      status: 'Reject'
    },
  ];
  const projectData: ProjectFetchData = {
    applications: applicationsData,
    deadline: new Date(2024, 6, 6),
    description: 'Test project 0 description',
    GPA: 1,
    id: '0',
    majors: [
      'Computer Science',
    ],
    numApp: applicationsData.length,
    number: 0,
    posted: new Date(2024, 2, 2),
    projectName: 'Test Project Name',
    projectType: 'active',
    questions: [],
  };

  beforeEach(() => {
    facultyService = jasmine.createSpyObj<FacultyService>('FacultyService', ['deleteProject', 'archiveProject']);
    facultyService.deleteProject.and.returnValue(of({
      success: {
        status: 200
      }
    }));
    facultyService.archiveProject.and.returnValue(of({
      success: {
        status: 200
      }
    }));

    TestBed.configureTestingModule({
      imports: [ResearchProjectCardComponent],
      providers: [
        provideRouter([]),
        { provide: FacultyService, useValue: facultyService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });
    fixture = TestBed.createComponent(ResearchProjectCardComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.project = projectData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.project).toEqual(projectData);
  });

  it('should navigate to the project update page', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    const updateButton = await loader.getHarness(MatButtonHarness.with({ text: 'Update' }));
    await updateButton.click();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/faculty/update-project/active/0']);
  });

  it('should return successful delete message', async () => {
    const deleteButton = await loader.getHarness(MatButtonHarness.with({ text: 'Delete' }));
    await deleteButton.click();
    expect(facultyService.deleteProject).toHaveBeenCalledOnceWith('0', 'Active');
  });

  it('should return successful archive message', async () => {
    const archiveButton = await loader.getHarness(MatButtonHarness.with({ text: 'Archive' }));
    await archiveButton.click();
    expect(facultyService.archiveProject).toHaveBeenCalledOnceWith('0');
  });

  it('should render project information correctly', async () => {
    const projectCard = await loader.getHarness(MatCardHarness);
    expect(await projectCard.getTitleText()).toEqual(projectData.projectName);
    const projectContent = await projectCard.getText();
    expect(projectContent).toContain('Posted: 3/2/24, 12:00 AM');
    expect(projectContent).toContain('Deadline: 7/6/24, 12:00 AM');
    expect(projectContent).toContain('Number of Applicants: 3');
    const cardButtons = await projectCard.getAllHarnesses(MatButtonHarness);
    expect(cardButtons.length).toEqual(3);
  });
});
