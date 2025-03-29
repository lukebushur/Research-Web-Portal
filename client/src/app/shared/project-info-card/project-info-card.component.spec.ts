import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoCardComponent } from './project-info-card.component';
import { StudentProjectInfo } from '../../students/models/student-project-info';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCardHarness } from '@angular/material/card/testing';

describe('ProjectInfoCardComponent', () => {
  let component: ProjectInfoCardComponent;
  let fixture: ComponentFixture<ProjectInfoCardComponent>;
  let loader: HarnessLoader;

  const professorEmail = 'professor@email.com';
  const partialProject: StudentProjectInfo = {
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
  };
  const project: StudentProjectInfo = {
    ...partialProject,
    responsibilities: 'Project Responsibilities',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProjectInfoCardComponent,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectInfoCardComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('professorEmail', professorEmail);
  });

  describe('Full Project Data', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('project', project);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render full project information', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual(project.projectName);

      const content = await card.getText();

      expect(content).toContain(`Professor: ${project.professorName} (${professorEmail})`);
      expect(content).toContain('Posted OnJanuary 1, 2025');
      expect(content).toContain('Available UntilFeb 1, 2025, 12:00:00 AM');
      expect(content).toContain(`Description:${project.description}`);
      expect(content).toContain(`Responsibilities:${project.responsibilities}`);
      expect(content).toContain(`Categories:${project.categories.join('')}`);
      expect(content).toContain('Minimum Required GPA:3.10');
      expect(content).toContain(`Applicable Major(s):${project.majors.join(', ')}`);
    });
  });

  describe('Minimal Project Data', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('project', partialProject);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render partial project information', async () => {
      const card = await loader.getHarness(MatCardHarness);

      expect(await card.getTitleText()).toEqual(partialProject.projectName);

      const content = await card.getText();

      expect(content).toContain(`Professor: ${partialProject.professorName} (${professorEmail})`);
      expect(content).toContain('Posted OnJanuary 1, 2025');
      expect(content).toContain('Available UntilFeb 1, 2025, 12:00:00 AM');
      expect(content).toContain(`Description:${partialProject.description}`);
      expect(content).toContain('Responsibilities:(Empty)');
      expect(content).toContain(`Categories:${partialProject.categories.join('')}`);
      expect(content).toContain('Minimum Required GPA:3.10');
      expect(content).toContain(`Applicable Major(s):${partialProject.majors.join(', ')}`);
    });
  });
});
