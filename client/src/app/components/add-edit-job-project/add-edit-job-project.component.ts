import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JobProject } from 'src/app/_models/industry/job-projects/jobProject';

@Component({
  selector: 'app-add-edit-job-project',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-edit-job-project.component.html',
  styleUrl: './add-edit-job-project.component.css'
})
export class AddEditJobProjectComponent {
  initialProjectData$ = new BehaviorSubject<JobProject | null>(null);
  isCreate: boolean = true;

  projectForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    skillsAssessed: ['', [Validators.required]],
    eta: ['', [Validators.required]],
    deadline: ['', [Validators.required]],
    materials: this.fb.array([]),
    submissionType: [true, [Validators.required]],
    fileTypes: this.fb.array([
      this.fb.control('.docx'),
      this.fb.control('.pdf'),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private announcer: LiveAnnouncer,
    private snackBar: MatSnackBar,
  ) { }

  chooseFile(): void {

  }

  cancel(): void {
    this.location.back();
  }

  onSubmit(): void {

  }
}
