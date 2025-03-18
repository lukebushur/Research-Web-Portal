import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProjectDescriptionComponent } from './student-project-description.component';
import { StudentProjectInfo } from '../models/student-project-info';

describe('StudentProjectDescriptionComponent', () => {
  let component: StudentProjectDescriptionComponent;
  let fixture: ComponentFixture<StudentProjectDescriptionComponent>;

  beforeEach(async () => {
    const project: StudentProjectInfo = {
      categories: ['Tech', 'IT'],
      deadline: new Date(2025, 1, 1),
      posted: new Date(2025, 0, 1),
      description: 'Project Description',
      GPA: 3.1,
      majors: ['Computer Science', 'Mathematics'],
      professorId: '123',
      professorName: 'Professor Name',
      projectName: 'Project Name',
      questions: [],
      responsibilities: 'Project Responsibilities',
    };

    await TestBed.configureTestingModule({
      imports: [
        StudentProjectDescriptionComponent,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProjectDescriptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('professorEmail', 'professor@email.com');
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
