import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewProjectComponent } from './student-view-project.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StudentViewProjectComponent', () => {
  let component: StudentViewProjectComponent;
  let fixture: ComponentFixture<StudentViewProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentViewProjectComponent, HttpClientTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentViewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
