import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProjectCardComponent } from './job-project-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JobProject } from 'src/app/_models/industry/job-projects/jobProject';

describe('JobProjectCardComponent', () => {
  let component: JobProjectCardComponent;
  let fixture: ComponentFixture<JobProjectCardComponent>;
  const jobProjectData: JobProject = {
    _id: '0',
    title: 'Test Job Project Title',
    description: 'test job project description',
    skillsAssessed: 'Computer Science, Communication',
    eta: '8 hours',
    materials: [],
    deadline: new Date(2024, 6, 20),
    submissionType: 'text',
    fileTypes: [],
    dateCreated: new Date(2024, 3, 29),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProjectCardComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobProjectCardComponent);
    component = fixture.componentInstance;
    component.jobProjectData = jobProjectData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
