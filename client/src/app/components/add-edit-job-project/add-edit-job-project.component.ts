import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JobProject } from 'src/app/_models/industry/job-projects/jobProject';
import { JobProjectService } from 'src/app/controllers/job-project-controller/job-project.service';

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
export class AddEditJobProjectComponent implements OnInit {
  initialProjectData: JobProject | null;
  isCreate: boolean = true;

  projectForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    skillsAssessed: ['', [Validators.required]],
    eta: ['', [Validators.required]],
    deadline: this.fb.control<Date | null>(null, [Validators.required]),
    materials: this.fb.array([]),
    submissionType: ['text', [Validators.required]],
    fileTypes: this.fb.array([
      this.fb.control('.docx'),
      this.fb.control('.pdf'),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private jobProjectService: JobProjectService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  get materials(): FormArray {
    return this.projectForm.get('materials') as FormArray;
  }

  get fileTypes(): FormArray {
    return this.projectForm.get('fileTypes') as FormArray;
  }

  ngOnInit(): void {
    this.projectForm.get('fileTypes')?.disable();
    const jobProjectId = this.route.snapshot.paramMap.get('jobProjectId');
    if (!jobProjectId) {
      return;
    }

    this.isCreate = false;
    this.jobProjectService.getJobProject(jobProjectId).subscribe({
      next: (data: JobProject) => {
        this.initialProjectData = data;
        this.projectForm.get('title')?.setValue(data.title);
        this.projectForm.get('description')?.setValue(data.description);
        this.projectForm.get('skillsAssessed')?.setValue(data.skillsAssessed);
        this.projectForm.get('eta')?.setValue(data.eta);
        this.projectForm.get('deadline')?.setValue(data.deadline);
        for (const material of data.materials ?? []) {
          this.materials.push(this.fb.control(material));
        }
        this.projectForm.get('submissionType')?.setValue(data.submissionType);
        this.fileTypes.clear();
        for (const fileType of data.fileTypes ?? []) {
          this.fileTypes.push(this.fb.control(fileType));
        }
      },
      error: (data: any) => {
        console.error('Error getting job project', data);
      }
    });
  }

  chooseFile(): void {
    // TODO once cloud storage is figured out
  }

  cancel(): void {
    this.location.back();
  }

  createJobProject(data: any): void {
    this.jobProjectService.createJobProject({ jobProjectDetails: data }).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/industry/job-projects']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open('Job project successfully created!', 'Dismiss', {
                duration: 5000,
              });
            }
          });
        }
      },
      error: (data: any) => {
        console.error('Create Job Project Failed', data);
        this.snackBar.open('Error creating job project', 'Dismiss', {
          duration: 5000,
        });
      },
    });
  }

  editJobProject(jobProjectId: string, data: any): void {
    const submissionData = {
      jobProjectId: jobProjectId,
      jobProjectDetails: data,
    };

    this.jobProjectService.editJobProject(submissionData).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.router.navigate(['/industry/job-projects']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open('Job project successfully updated!', 'Dismiss', {
                duration: 5000,
              });
            }
          });
        }
      },
      error: (data: any) => {
        console.error('Edit Job Project Failed', data);
        this.snackBar.open('Error updating job project', 'Dismiss', {
          duration: 5000,
        });
      },
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.snackBar.open('1 or more invalid fields', 'Dismiss', {
        duration: 5000,
      });
      return;
    }

    if (this.isCreate) {
      this.createJobProject(this.projectForm.value);
    } else {
      this.editJobProject(this.initialProjectData!._id, this.projectForm.value);
    }
  }
}
