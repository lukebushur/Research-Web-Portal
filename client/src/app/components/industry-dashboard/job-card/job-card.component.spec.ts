import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardComponent } from './job-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { of } from 'rxjs';
import { IndustryDashboardService } from 'src/app/controllers/industry-dashboard-controller/industry-dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('JobCardComponent', () => {
  let component: JobCardComponent;
  let fixture: ComponentFixture<JobCardComponent>;
  let loader: HarnessLoader;
  let testDeleteJobsResponse: Object;
  let deleteJobSpy: jasmine.Spy;

  beforeEach(() => {
    testDeleteJobsResponse = {
      success: {
        status: 200,
        message: 'JOB_DELETED',
      },
    };

    const industryDashboardService = jasmine.createSpyObj('IndustryDashboardService', ['deleteJob']);
    deleteJobSpy = industryDashboardService.deleteJob.and.returnValue(of(testDeleteJobsResponse));

    TestBed.configureTestingModule({
      declarations: [JobCardComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatTooltipModule,
      ],
      providers: [
        { provide: IndustryDashboardService, useValue: industryDashboardService }
      ],
    });
    fixture = TestBed.createComponent(JobCardComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.jobData = {
      _id: '1234',
      employer: 'Quantum Innovations Co.',
      title: 'Senior Quantum Computing Engineer',
      isInternship: false,
      isFullTime: true,
      description: `Are you passionate about pushing the boundaries of 
computing technology? Join Quantum Innovations Co. as a Senior Quantum 
Computing Engineer and be at the forefront of revolutionizing the world of 
quantum computing. In this role, you will work on cutting-edge projects, 
collaborate with a team of experts, and contribute to the development of 
groundbreaking quantum algorithms. If you thrive in a dynamic and 
intellectually stimulating environment, apply now!`,
      location: 'Silicon Valley, CA',
      reqYearsExp: 5,
      tags: [
        'Quantum Computing',
        'Algorithm Development',
        'Quantum Information',
        'Python',
        'Qiskit',
        'Research',
      ],
      timeCommitment: '40 hrs/week',
      pay: 'Competitive salary commensurate with experience, plus performance-based bonuses.',
      deadline: '2024-03-15T04:00:00.000+00:00',
      startDate: '2024-05-01T04:00:00.000+00:00',
      endDate: '2025-05-01T04:00:00.000+00:00',
      datePosted: '2024-02-05T19:27:56.841+00:00',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a material card', async () => {
    const card = await loader.getHarnessOrNull(MatCardHarness);
    expect(card).not.toBeNull();
  });

  it('should create 2 card buttons', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
  });

  it('should return a proper tagsString', () => {
    let tagsStrResult = component.tagsString();
    expect(tagsStrResult).toBe('Quantum Computing, Algorithm Development, ' +
      'Quantum Information, Python, Qiskit, Research');
  });

  it('should return a proper jobTypeString', () => {
    const jts = component.jobTypeString;
    expect(jts).toEqual('Full-Time Job');
  });

  it('should return a proper display string for dateToString()', () => {
    let dateStrResult = component.dateToString(undefined);
    expect(dateStrResult).toEqual('None');
    const dateStr = component.jobData.deadline!;
    dateStrResult = component.dateToString(dateStr);
    expect(dateStrResult).toEqual('Mar 15, 2024');
  });

  it('should call deleteJob() from the industryDashboardService', () => {
    component.deleteJob();
    expect(deleteJobSpy).toHaveBeenCalledOnceWith(component.jobData._id);
  });

  // TODO: Unit tests for editJob()
});
