import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentChooserComponent } from './assessment-chooser.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AssessmentChooserComponent', () => {
  let component: AssessmentChooserComponent;
  let fixture: ComponentFixture<AssessmentChooserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatProgressBarModule,
        AssessmentChooserComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });
    fixture = TestBed.createComponent(AssessmentChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
