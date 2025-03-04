import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacultyProjectService } from 'app/controllers/faculty-project-controller/faculty-project.service';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { AsyncPipe, DatePipe, DecimalPipe, Location } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { QuestionData } from 'app/_models/projects/questionData';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


// interface for storing project data
interface ProjectData {
  projectName: string;
  professorName: string;
  description: string;
  responsibilities: string;
  categories: string[];
  posted: Date;
  GPA: number;
  majors: string[];
  deadline: Date;
  questions: QuestionData[];
};

// interface
interface ApplicantData {
  application: string;
  appliedDate: Date;
  name: string;
  email: string;
  GPA: number;
  majors: string;
  location: string;
  questions: QuestionData[];
  lastModified: Date;
  status: 'Accept' | 'Reject' | 'Pending';
};

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css'],
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    MatExpansionModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSliderModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    SpinnerComponent,
    MatCardModule,
  ]
})

export class ViewProjectComponent implements OnInit, AfterContentInit {

  // Project data stored in behavior subject, which requires an initial value,
  // and it emits the current value to any new subscribers.
  // It is used with the async pipe in the template (HTML) to load the page
  // content only when the data is loaded (after HTTP request finishes).
  projectData$ = new BehaviorSubject<ProjectData | null>(null);
  // array for easily accessing the project's questions
  questions: QuestionData[];

  // URL parameters
  projectId: string;
  projectType: string; //projectType, grabbed from the url parameter and used in requests

  // holds all the applicant data for the project
  allApplicantsData: ApplicantData[];
  // holds the applicant data filtered by the custom filters on the page
  filteredApplicantsData: ApplicantData[];
  // This object is used for the Material table data source to enable sorting,
  // filtering, pagination, etc.
  dataSource = new MatTableDataSource<ApplicantData>([]);

  // Material table sort and pginator objects
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // This array determines the displayedd columns in the table.
  displayedColumns: string[] = ['name', 'email', 'GPA', 'majors', 'status'];

  // Variables holding the minimum and maximum values currently reflected by
  // the GPA slider on the page. This is used for filtering applicants.
  minGPA: number = 0;
  maxGPA: number = 4;

  constructor(
    private route: ActivatedRoute,
    private facultyService: FacultyProjectService,
    private _liveAnnouncer: LiveAnnouncer,
    private location: Location,
    public dialog: MatDialog
  ) {
    // Grab project type and project ID from the URL parameters
    this.projectType = this.route.snapshot.paramMap.get('projectType')!;
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
  }

  ngOnInit(): void {
    // Get project data.
    // The request is piped into a map to transform the data to match the
    // ProjectData interface. It also catches any errors.
    // Once transformed, projectData$ and other variables are are assigned.
    this.facultyService.getProject(
      this.projectId,
      this.projectType
    ).pipe(
      map((data: any) => {
        const projectData = data.success.project;
        return <ProjectData>{
          ...projectData,
          posted: new Date(projectData.posted),
          deadline: new Date(projectData.deadline),
        };
      }),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    ).subscribe({
      next: (projectData: ProjectData | null) => {
        // initialize variables' values
        this.projectData$.next(projectData);
        this.questions = projectData?.questions ?? [];
        this.currentQuestionIndex = 0;
        this.currentQuestionType = this.questions[0].requirementType;
        this.currentQuestion = this.questions[0].question;
        this.facultyAnswers = [];
        this.questions.forEach(question => {
          if (question.requirementType !== 'check box') {
            this.facultyAnswers.push('');
          } else {
            this.facultyAnswers.push([]);
          }
        });
      }
    });
  }

  // After the table is loaded in the DOM, then the table sort and paginator
  // will be set. Thus, the table values and functionality can be initialized.
  ngAfterContentInit(): void {
    this.getStudentApplicants().subscribe({
      next: (applicantData: ApplicantData[]) => {
        this.allApplicantsData = applicantData;
        this.filteredApplicantsData = applicantData;
        this.dataSource.data = applicantData;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  // Get applicants data.
  // The request is piped into a map to transform the data to match the
  // ApplicantData interface. It also catches any errors.
  // Returns the transformed result of the HTTP request (applicants data).
  getStudentApplicants(): Observable<ApplicantData[]> {
    return this.facultyService.detailedFetchApplicants(this.projectId).pipe(
      map((data: any) => {
        const applicantsData: any[] = data.success.applicants;
        return applicantsData.map((applicantData: any) => {
          return <ApplicantData>{
            ...applicantData,
            majors: applicantData.majors.join(', '),
            appliedDate: new Date(applicantData.appliedDate),
            lastModified: new Date(applicantData.lastModified),
          }
        });
      }),
      catchError((error: any) => {
        console.log(error);
        const emptyApplicants: ApplicantData[] = [];
        return of(emptyApplicants);
      })
    );
  }

  // Return a more understandable string for displaying what the given question
  // requirementType is
  displayRequirementType(reqType: string): string {
    if (reqType === 'text') {
      return 'Text Response';
    } else if (reqType === 'radio button') {
      return 'Single Select';
    } else if (reqType === 'check box') {
      return 'Multiple Select';
    }
    return 'Invalid Question Type';
  }

  // called whenever the user uses the text field right above the table to
  // filter the results
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Necessary method for sorting the table with the material UI tables
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // This method makes a request to the server updating the decision then fetches the applicants
  applicationDecision(app: any, decision: string) {
    this.facultyService.applicationDecide(app, this.projectId, decision).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.fetchApplicants();
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      }
    });
  }

  // Method to update the table of applied students based upon the filters
  applyCustomFilters(): void {
    this.filteredApplicantsData = this.allApplicantsData.filter((applicant: ApplicantData) => {
      // Compare GPA to min/max
      const passesGPACheck = this.minGPA <= applicant.GPA && applicant.GPA <= this.maxGPA;
      // Calls checkAnswers to filter students by the answers the faculty has selected
      const passesQuestionsCheck = this.checkAnswers(applicant.questions);
      // Only pass this student if it passes the GPA check
      return passesGPACheck && passesQuestionsCheck;
    });

    // Set the new data (update table)
    this.dataSource.data = this.filteredApplicantsData;
  }

  // This method fetches the applicants and then updates the applicants table,
  // making sure to apply the custom filters again.
  fetchApplicants() {
    this.getStudentApplicants().subscribe({
      next: (applicantData: ApplicantData[]) => {
        this.allApplicantsData = applicantData;
        this.applyCustomFilters();
      },
    });
  }

  // This code is used for the question filtering by faculty. What happens is the
  // faculty can move through each of their questions and provide their answers
  // to the questions. Then the applied students table is filtered to only
  // include students whose responses match their own.

  // This number is the current index for the question array. It exists to make
  // the accessing of a particular element of the arrays easier in the HTML.
  currentQuestionIndex: number;
  // This string stores the current question type, this lets the HTML know which
  // question to load.
  currentQuestionType: string;
  // This string holds the current question of the questions array.
  currentQuestion: string;
  // This array stores the faculty's choices for their questions, and is used to
  // filter the students based on their answers compared to the faculty's.
  facultyAnswers: any[] = [];

  // This method moves the question card in the HTML to its previous question.
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex].question;
      this.currentQuestionType = this.questions[this.currentQuestionIndex].requirementType;
    }
  }

  // This method moves the question card to the next question.
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex].question;
      this.currentQuestionType = this.questions[this.currentQuestionIndex].requirementType;
    }
  }

  // This method checks to see if the questions provided by the faculty match
  // the student parameter's questions.
  checkAnswers(studentQuestions: any) {
    // iterate through all faculty answers
    for (let x = 0; x < this.facultyAnswers.length; x++) {
      // Check if the requirement is radio button. If so, ensure the choices
      // are equal.
      if (this.questions[x].requirementType === "radio button") {
        if (this.facultyAnswers[x] != "" && this.facultyAnswers[x] != studentQuestions[x].answers[0]) {
          return false;
        }
        // Check if the requirement is check box. If so, ensure the student
        // response has all the faculty choices.
      } else if (this.questions[x].requirementType === "check box") {
        if (!this.facultyAnswers[x].every((element: any) => studentQuestions[x].answers.includes(element))) {
          return false;
        }
        // Check if the requirement is text. If so, then check that the input
        // string matches the text body.
      } else if (this.questions[x].requirementType === "text") {
        if (this.facultyAnswers[x] != "" && !studentQuestions[x].answers[0].includes(this.facultyAnswers[x])) {
          return false;
        }
      }
    }
    // if the code reaches here, then the above checks have passed for all questions
    return true;
  }

  // This method updates the faculty answer for a text response then updates the table.
  updateTextAnswer(event: any) {
    const inputValue = event?.target?.value;
    if (inputValue !== undefined) {
      this.facultyAnswers[this.currentQuestionIndex] = inputValue;
      this.applyCustomFilters();
    }
  }

  // This method updates the choices for check box or radio button, then updates the table.
  updateChoiceAnswer(event: any) {
    if (this.currentQuestionType === "radio button") {
      this.facultyAnswers[this.currentQuestionIndex] = event.value;
    } else if (this.currentQuestionType === "check box" && event.checked) {
      this.facultyAnswers[this.currentQuestionIndex].push(event.source.value);
    } else if (this.currentQuestionType === "check box" && !event.checked) {
      this.facultyAnswers[this.currentQuestionIndex] = this.facultyAnswers[this.currentQuestionIndex].filter((choice: any) => choice !== event.source.value);
    }
    this.applyCustomFilters();
  }

  // This method should remove the selection of a radio button
  // (it is currently not implemented).
  removeSelection() {
    this.facultyAnswers[this.currentQuestionIndex] = "";
  }

  // This method resets all choices for the faculty answers either to a new,
  // empty array for check boxes or an empty string for radio buttons and text.
  // Then, it updates the table to reset the applicants.
  resetAnswers() {
    for (let i = 0; i < this.facultyAnswers.length; i++) {
      if (typeof (this.facultyAnswers[i]) === "string") {
        this.facultyAnswers[i] = "";
      } else {
        this.facultyAnswers[i] = [];
      }
    }
    this.applyCustomFilters();
  }

  // Send the user back
  back() {
    this.location.back();
  }

  openConfirmationDialog(app: string, decision: string, sentence: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: sentence } });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User clicked "Yes", perform your action here
        this.applicationDecision(app, decision);
      } else {
        // User clicked "No" or closed the dialog
      }
    });
  }
}
