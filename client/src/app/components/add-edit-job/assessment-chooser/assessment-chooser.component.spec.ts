import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentChooserComponent } from './assessment-chooser.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('AssessmentChooserComponent', () => {
  let component: AssessmentChooserComponent;
  let fixture: ComponentFixture<AssessmentChooserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatProgressBarModule,
        AssessmentChooserComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(AssessmentChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
