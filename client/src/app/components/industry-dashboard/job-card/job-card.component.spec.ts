import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardComponent } from './job-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

describe('JobCardComponent', () => {
  let component: JobCardComponent;
  let fixture: ComponentFixture<JobCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobCardComponent],
      imports: [
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
      ],
    });
    fixture = TestBed.createComponent(JobCardComponent);
    component = fixture.componentInstance;
    component.jobData = {
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

  it('should create a material card', () => {
    const cardElement: HTMLElement = fixture.nativeElement;
    const matCard = cardElement.querySelector('mat-card')!;
    expect(matCard).toBeTruthy();
  });

  it('should create 6 chips in the mat-chip-set', () => {
    const cardElement: HTMLElement = fixture.nativeElement;
    const matChips = cardElement.querySelectorAll('mat-chip')!;
    expect(matChips.length).toEqual(6);
  });

  it('should create 3 card buttons', () => {
    const cardElement: HTMLElement = fixture.nativeElement;
    const buttons = cardElement.querySelectorAll('button')!;
    expect(buttons.length).toEqual(3);
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
});
