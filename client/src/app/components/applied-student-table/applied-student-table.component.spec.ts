import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AppliedStudentTableComponent } from './applied-student-table.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('AppliedStudentTableComponent', () => {
  let component: AppliedStudentTableComponent;
  let fixture: ComponentFixture<AppliedStudentTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppliedStudentTableComponent],
      imports: [HttpClientTestingModule, MatTableModule, MatPaginatorModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule],
    });
    fixture = TestBed.createComponent(AppliedStudentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
