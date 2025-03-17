import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProjectDescriptionComponent } from './student-project-description.component';

describe('StudentProjectDescriptionComponent', () => {
  let component: StudentProjectDescriptionComponent;
  let fixture: ComponentFixture<StudentProjectDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentProjectDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProjectDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
