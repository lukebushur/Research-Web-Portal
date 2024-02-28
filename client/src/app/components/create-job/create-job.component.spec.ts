import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateJobComponent } from './create-job.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateJobComponent', () => {
  let component: CreateJobComponent;
  let fixture: ComponentFixture<CreateJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateJobComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatRadioModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(CreateJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
