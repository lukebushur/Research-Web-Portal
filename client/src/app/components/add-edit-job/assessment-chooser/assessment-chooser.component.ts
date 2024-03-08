import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssessmentData } from 'src/app/_models/assessments/assessmentData';
import { AssessmentsService } from 'src/app/controllers/assessments-controller/assessments.service';

@Component({
  selector: 'app-assessment-chooser',
  templateUrl: './assessment-chooser.component.html',
  styleUrls: ['./assessment-chooser.component.css']
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
