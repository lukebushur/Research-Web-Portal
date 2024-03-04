import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentViewApplicationComponent } from '../student-view-application/student-view-application.component';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

describe('StudentViewApplicationComponent', () => {
  let component: StudentViewApplicationComponent;
  let fixture: ComponentFixture<StudentViewApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentViewApplicationComponent],
      imports: [HttpClientTestingModule, RouterModule.forRoot([])], // Import RouterModule
      providers: [
        {
          provide: StudentDashboardService,
          useValue: {}
        },
        {
          provide: DateConverterService,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentViewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component);
  });
});
