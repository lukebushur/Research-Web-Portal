import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppliedStudentTableComponent } from './applied-student-table.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectFetchData } from 'app/_models/projects/projectFetchData';
import { Application } from 'app/_models/applications/application';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SimpleChange } from '@angular/core';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSortHarness } from '@angular/material/sort/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { FacultyProjectService } from 'app/controllers/faculty-project-controller/faculty-project.service';
import { of } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

describe('AppliedStudentTableComponent', () => {
  let component: AppliedStudentTableComponent;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<AppliedStudentTableComponent>;
  let facultyService: jasmine.SpyObj<FacultyProjectService>;
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
    description: 'Test project description',
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
  };

  beforeEach(() => {
    facultyService = jasmine.createSpyObj<FacultyProjectService>('FacultyProjectService', ['applicationDecide']);
    facultyService.applicationDecide.and.returnValue(of({
      success: {
        status: 200,
        message: 'APPLICATION_STATUS_UPDATED'
      }
    }));

    TestBed.configureTestingModule({
      imports: [
        AppliedStudentTableComponent,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: FacultyProjectService, useValue: facultyService },
      ]
    });
    fixture = TestBed.createComponent(AppliedStudentTableComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.project = null;
    fixture.detectChanges();
  });

  it('should create with null project', () => {
    expect(component).toBeTruthy();
    expect(component.project).toBeNull();
  });

  it('should create with projectData after it is changed', async () => {
    component.project = projectData;
    component.ngOnChanges({
      project: new SimpleChange(null, projectData, false),
    });

    expect(component.appliedStudents).toEqual(projectData.applications.map((app: Application) => {
      return {
        name: app.name,
        gpa: app.GPA,
        majors: app.major.join(', '),
        email: app.email,
        status: app.status,
        project: projectData.id,
        application: app.application
      };
    }));
  });

  it('should display a Material Table in the DOM', async () => {
    component.project = projectData;
    component.ngOnChanges({
      project: new SimpleChange(null, projectData, false),
    });

    const table = await loader.getHarness(MatTableHarness);
    const tableHeaders = await table.getHeaderRows();
    const text = tableHeaders[0];
    expect(await text.getCellTextByIndex()).toContain('Name');
    expect(await text.getCellTextByIndex()).toContain('GPA');
    expect(await text.getCellTextByIndex()).toContain('Majors');
    expect(await text.getCellTextByIndex()).toContain('Email');
    expect(await text.getCellTextByIndex()).toContain('Status');

    const tableRows = await table.getRows();
    expect(tableRows.length).toEqual(3);
    for (let i = 0; i < tableRows.length; i++) {
      expect((await tableRows[i].getCellTextByIndex())[0]).toEqual(applicationsData[i].name);
      expect((await tableRows[i].getCellTextByIndex())[1]).toEqual('' + applicationsData[i].GPA);
      expect((await tableRows[i].getCellTextByIndex())[2]).toEqual(applicationsData[i].major.join(', '));
      expect((await tableRows[i].getCellTextByIndex())[3]).toEqual(applicationsData[i].email);
      expect((await tableRows[i].getCellTextByIndex())[4]).toEqual(applicationsData[i].status === 'Pending'
        ? 'AcceptReject'
        : applicationsData[i].status + 'ed'
      );
    }
  });

  it('should filter the table by the filter text field', async () => {
    component.project = projectData;
    component.ngOnChanges({
      project: new SimpleChange(null, projectData, false),
    });

    const filterInput = await loader.getHarness(MatInputHarness);
    await filterInput.setValue('Name 1');
    expect(component.dataSource.filter).toEqual('name 1');

    const table = await loader.getHarness(MatTableHarness);
    const tableRows = await table.getRows();
    expect(tableRows.length).toEqual(1);
    const tableRowText = await tableRows[0].getCellTextByIndex();
    expect(tableRowText[0]).toEqual('Name 1');
    expect(tableRowText[1]).toEqual('2');
    expect(tableRowText[2]).toEqual('Computer Science, Music, Information Technology');
    expect(tableRowText[3]).toEqual('name1@email.com');
    expect(tableRowText[4]).toEqual('AcceptReject');
  });

  it('should sort the table by GPA descending', async () => {
    component.project = projectData;
    component.ngOnChanges({
      project: new SimpleChange(null, projectData, false),
    });

    const tableSort = await loader.getHarness(MatSortHarness);
    const sortHeaders = await tableSort.getSortHeaders();
    expect(await sortHeaders[1].getLabel()).toEqual('GPA');
    await sortHeaders[1].click();
    expect(await sortHeaders[1].isActive()).toBeTrue();
    expect(await sortHeaders[1].getSortDirection()).toEqual('asc');
    await sortHeaders[1].click();
    expect(await sortHeaders[1].isActive()).toBeTrue();
    expect(await sortHeaders[1].getSortDirection()).toEqual('desc');

    const table = await loader.getHarness(MatTableHarness);
    const tableRows = await table.getRows();
    expect(tableRows.length).toEqual(3);
    expect(await tableRows[0].getCellTextByIndex()).toContain('Name 3');
    expect(await tableRows[1].getCellTextByIndex()).toContain('Name 2');
    expect(await tableRows[2].getCellTextByIndex()).toContain('Name 1');

    await sortHeaders[1].click();
    expect(await sortHeaders[1].isActive()).toBeFalse();
  });

  it('should paginate the table correctly', async () => {
    const moreAppsProjectData: ProjectFetchData = {
      ...projectData,
      numApp: 14,
      applications: [],
    }
    for (let i = 0; i < 14; i++) {
      moreAppsProjectData.applications.push({
        _id: '' + i,
        application: i + '' + i,
        applicationRecordID: i + '' + i + '' + i,
        appliedDate: new Date(),
        email: 'name' + i + '@email.com',
        GPA: 3.0,
        location: 'Purdue University Fort Wayne',
        major: [
          'Computer Science',
          'Information Technology',
        ],
        name: 'Name ' + i,
        status: 'Pending'
      });
    }
    component.project = moreAppsProjectData;
    component.ngOnChanges({
      project: new SimpleChange(null, moreAppsProjectData, false),
    });

    const tablePaginator = await loader.getHarness(MatPaginatorHarness);
    expect(await tablePaginator.getPageSize()).toEqual(5);
    expect(await tablePaginator.isPreviousPageDisabled()).toBeTrue();
    expect(await tablePaginator.isNextPageDisabled()).toBeFalse();
    let table = await loader.getHarness(MatTableHarness);
    let tableRows = await table.getRows();
    expect(tableRows.length).toEqual(5);
    for (let i = 0; i < tableRows.length; i++) {
      expect((await tableRows[i].getCellTextByIndex())[0]).toEqual('Name ' + i);
    }

    await tablePaginator.goToNextPage();
    expect(await tablePaginator.isPreviousPageDisabled()).toBeFalse();
    expect(await tablePaginator.isNextPageDisabled()).toBeFalse();
    table = await loader.getHarness(MatTableHarness);
    tableRows = await table.getRows();
    expect(tableRows.length).toEqual(5);
    for (let i = 0; i < tableRows.length; i++) {
      expect((await tableRows[i].getCellTextByIndex())[0]).toEqual('Name ' + (i + 5));
    }

    await tablePaginator.goToNextPage();
    expect(await tablePaginator.isPreviousPageDisabled()).toBeFalse();
    expect(await tablePaginator.isNextPageDisabled()).toBeTrue();
    table = await loader.getHarness(MatTableHarness);
    tableRows = await table.getRows();
    expect(tableRows.length).toEqual(4);
    for (let i = 0; i < tableRows.length; i++) {
      expect((await tableRows[i].getCellTextByIndex())[0]).toEqual('Name ' + (i + 10));
    }
  });

  // it('should open ConfirmationDialogComponent', async () => {
  //   component.project = projectData;
  //   component.ngOnChanges({
  //     project: new SimpleChange(null, projectData, false),
  //   });
  //   // const outputSpy = spyOn(component.applicationUpdateEvent, 'emit');
  //   spyOn(component.dialog, 'open').and.callThrough();

  //   const table = await loader.getHarness(MatTableHarness);
  //   const tableRows = await table.getRows();
  //   const pendingAppCells = await tableRows[0].getCells();
  //   // expect(await pendingAppCells[4].hasHarness(MatButtonHarness)).toBeTrue();
  //   // const acceptAppButton = await pendingAppCells[4].getHarness(MatButtonHarness);

  //   // await acceptAppButton.click();
  //   //   expect(facultyService.applicationDecide).toHaveBeenCalledOnceWith(
  //   //     projectData.applications[0].application,
  //   //     projectData.id,
  //   //     'Accept'
  //   //   );
  //   //   expect(outputSpy).toHaveBeenCalledOnceWith(projectData.number);

  //   //await acceptAppButton.click();
  //  // expect(component.dialog.open).toHaveBeenCalledOnceWith(ConfirmationDialogComponent, {
  //   // data: {
  //   //    message: 'accept this user?'
  //   //  }
  //  // });
  // });
});
