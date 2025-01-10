import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AssessmentData } from 'app/_models/assessments/assessmentData';
import { AssessmentsService } from 'app/controllers/assessments-controller/assessments.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-assessment-chooser',
  templateUrl: './assessment-chooser.component.html',
  styleUrls: ['./assessment-chooser.component.css'],
  imports: [
    MatDialogModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class AssessmentChooserComponent {
  assessments: AssessmentData[];
  assessmentControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<AssessmentChooserComponent>,
    private assessmentsService: AssessmentsService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.assessmentsService.getAssessments().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.assessments = data.success.assessments;
        }
      },
      error: (data: any) => {
        console.log('Error', data);
        this.snackbar.open('Error loading assessments', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
