import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultyDashboardComponent } from './faculty-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FacultyService } from '../faculty-service/faculty.service';
import { of } from 'rxjs';
import { Application } from 'app/_models/applications/application';
import { ProjectFetchData } from '../models/projectFetchData';
import { Router, provideRouter } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness } from '@angular/material/tabs/testing'
import { MatButtonHarness } from '@angular/material/button/testing';

describe('FacultyDashboardComponent', () => {
  let component: FacultyDashboardComponent;
  let fixture: ComponentFixture<FacultyDashboardComponent>;
  let facultyService: jasmine.SpyObj<FacultyService>;
  let router: Router;
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
  const projectData: ProjectFetchData[] = [
    {
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
      professorId: '00',
      projectName: 'Test Project Name',
      projectType: 'active',
      questions: [],
    },
    {
      applications: applicationsData,
      deadline: new Date(2024, 6, 6),
      description: 'Test project 1 description',
      GPA: 1,
      id: '0',
      majors: [
        'Computer Science',
      ],
      numApp: applicationsData.length,
      number: 1,
      posted: new Date(2024, 2, 2),
      professorId: '00',
      projectName: 'Test Project Name',
      projectType: 'draft',
      questions: [],
    },
    {
      applications: applicationsData,
      deadline: new Date(2024, 6, 6),
      description: 'Test project 2 description',
      GPA: 1,
      id: '0',
      majors: [
        'Computer Science',
      ],
      numApp: applicationsData.length,
      number: 2,
      posted: new Date(2024, 2, 2),
      professorId: '00',
      projectName: 'Test Project Name',
      projectType: 'archived',
      questions: [],
    },
  ];

  beforeEach(() => {
    facultyService = jasmine.createSpyObj<FacultyService>('FacultyService', ['getProjects']);
    facultyService.getProjects.and.returnValue(of({
      success: {
        projects: projectData
      }
    }));

    TestBed.configureTestingModule({
      imports: [
        FacultyDashboardComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: FacultyService, useValue: facultyService },
      ]
    });
    fixture = TestBed.createComponent(FacultyDashboardComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.projects$.getValue()!.active.length).toEqual(1);
    expect(component.projects$.getValue()!.active[0].projectName).toEqual(projectData[0].projectName);
    expect(component.projects$.getValue()!.draft.length).toEqual(1);
    expect(component.projects$.getValue()!.draft[0].projectName).toEqual(projectData[1].projectName);
    expect(component.projects$.getValue()!.archived.length).toEqual(1);
    expect(component.projects$.getValue()!.archived[0].projectName).toEqual(projectData[2].projectName);
    expect(component.selectedIndex$.getValue()).toEqual(-1);
    expect(component.selectedProject$.getValue()).toEqual(null);
    expect(facultyService.getProjects).toHaveBeenCalled();
  });

  it('should update the selected index and project', () => {
    component.updatedSelected(1, projectData[1]);
    expect(component.selectedIndex$.getValue()).toEqual(1);
    expect(component.selectedProject$.getValue()).toEqual(projectData[1]);
  });

  it('should update the selected index and project', () => {
    component.updatedSelected(1, projectData[1]);
    component.updateProjects(1);
    expect(facultyService.getProjects).toHaveBeenCalledTimes(2);
    expect(component.selectedIndex$.getValue()).toEqual(-1);
    expect(component.selectedProject$.getValue()).toEqual(null);
  });

  it('should navigate to the create project page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.createNewProject();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/faculty/create-project']);
  });

  it('should render Angular Material tabs', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const tabs = await tabGroup.getTabs();
    expect(tabs.length).toEqual(3);
    expect(await tabs[0].getLabel()).toEqual('Active Projects');
    expect(await tabs[1].getLabel()).toEqual('Draft Projects');
    expect(await tabs[2].getLabel()).toEqual('Archived Projects');
    expect(await tabs[0].isSelected()).toBeTrue();

  });

  it('should navigate to the create project page after pressing the associated button', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    const createButton = await loader.getHarness(MatButtonHarness.with({ text: 'Create New Project' }));
    await createButton.click();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/faculty/create-project']);
  });
});
