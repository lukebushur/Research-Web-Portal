import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ResearchProjectCardComponent } from './research-project-card.component';
import { provideRouter } from '@angular/router';
import { ProjectFetchData } from 'src/app/_models/projects/projectFetchData';

describe('ResearchProjectCardComponent', () => {
  let component: ResearchProjectCardComponent;
  let fixture: ComponentFixture<ResearchProjectCardComponent>;
  const project: ProjectFetchData = {
    applications: [],
    deadline: new Date(),
    description: 'description',
    GPA: 1,
    id: '123',
    majors: [],
    numApp: 0,
    number: 0,
    posted: new Date(),
    professorId: '124',
    projectName: 'Test Name',
    projectType: 'active',
    questions: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ResearchProjectCardComponent],
      providers: [
        provideRouter([]),
      ]
    });
    fixture = TestBed.createComponent(ResearchProjectCardComponent);
    component = fixture.componentInstance;
    component.project = project;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
