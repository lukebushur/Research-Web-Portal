import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AppliedStudentTableComponent } from './applied-student-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppliedStudentTableComponent', () => {
  let component: AppliedStudentTableComponent;
  let fixture: ComponentFixture<AppliedStudentTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppliedStudentTableComponent],
      imports: [HttpClientTestingModule, MatTableModule, MatFormFieldModule, FormsModule, MatInputModule, BrowserAnimationsModule],
    });
    fixture = TestBed.createComponent(AppliedStudentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
