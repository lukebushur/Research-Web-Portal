import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { IndustryDashboardComponent } from './industry-dashboard.component';
import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JobCardData } from '../../industry/models/job-card-data';
import { of } from 'rxjs';
import { IndustryService } from '../industry-service/industry.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({ standalone: true, selector: 'app-job-card', template: '' })
class JobCardStubComponent { @Input() jobData: JobCardData }

describe('IndustryDashboardComponent', () => {
  let component: IndustryDashboardComponent;
  let fixture: ComponentFixture<IndustryDashboardComponent>;

  let industryService: jasmine.SpyObj<IndustryService>;

  let testGetJobsResponse: Object;

  beforeEach(() => {
    testGetJobsResponse = {
      success: {
        jobs: {
          active: [
            {
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
            },
          ],
          draft: [],
          archived: [],
        }
      }
    };

    industryService = jasmine.createSpyObj<IndustryService>('IndustryService', ['getJobs']);
    industryService.getJobs.and.returnValue(of(testGetJobsResponse));

    TestBed.configureTestingModule({
      imports: [
        JobCardStubComponent,
        MatTabsModule,
        BrowserAnimationsModule,
        IndustryDashboardComponent
      ],
      providers: [
        { provide: IndustryService, useValue: industryService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });
    fixture = TestBed.createComponent(IndustryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a tab group', () => {
    const dashboardElement: HTMLElement = fixture.nativeElement;
    const tabGroup = dashboardElement.querySelector('mat-tab-group')!;
    expect(tabGroup).toBeTruthy();
    const jobsContainer = dashboardElement.querySelector('div.jobs-container')!;
    expect(jobsContainer).toBeTruthy();
    const jobCard = dashboardElement.querySelector('app-job-card')!;
    expect(jobCard).toBeTruthy();
  });

  it('should create a job card component', () => {
    const dashboardElement: HTMLElement = fixture.nativeElement;
    const jobCard = dashboardElement.querySelector('app-job-card')!;
    expect(jobCard).toBeTruthy();
  });
});
