import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentApplicationsOverviewComponent } from './student-applications-overview.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



describe('StudentApplicationsOverviewComponent', () => {
  let component: StudentApplicationsOverviewComponent;
  let fixture: ComponentFixture<StudentApplicationsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        StudentApplicationsOverviewComponent,
        SpinnerComponent,
      ],
    });
    fixture = TestBed.createComponent(StudentApplicationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
