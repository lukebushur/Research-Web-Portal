import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
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
import { QuestionData } from 'src/app/_models/projects/questionData';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
  standalone: true,
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
    MatCardModule
  ]
})

export class ViewProjectComponent implements OnInit, AfterViewInit {

  projectData$ = new BehaviorSubject<ProjectData | null>(null);
  projectId: string;
  projectType: string; //projectType, grabbed from the url parameter and used in requests
  questions: QuestionData[];

  allApplicantsData: ApplicantData[];
  filteredApplicantsData: ApplicantData[];
  dataSource = new MatTableDataSource<ApplicantData>([]); // = new MatTableDataSource(this.studentData); //This object is used for the material table data source to allow for the table to work/sort etc
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'email', 'GPA', 'majors', 'status']; //This array determines the displayedd columns in the table
  minGPA: number = 0;
  maxGPA: number = 4;

  constructor(
    private route: ActivatedRoute,
    private facultyService: FacultyProjectService,
    private _liveAnnouncer: LiveAnnouncer,
    private location: Location
  ) {
    // Grab project type and project ID from the URL parameters
    this.projectType = this.route.snapshot.paramMap.get('projectType')!;
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
  }

  ngOnInit(): void {
    //Get project data from database, this only grabs the project name currently, but if more information is need it will exist in the data variable below
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

  ngAfterViewInit(): void {
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

  getStudentApplicants(): Observable<ApplicantData[]> {
    return this.facultyService.detailedFetchApplicants(this.projectId).pipe(
      map((data: any) => {
        const applicantsData: any[] = data.success.applicants;
        console.log(applicantsData);
        
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

  // called whenever the user types in the filter text field
  // filters the table, removing rows that do not match with the filter text
  // field value
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

  //This method makes a request to the server updating the decision then fetches the applicants
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

  applyCustomFilters(): void {
    this.filteredApplicantsData = this.allApplicantsData.filter((applicant: ApplicantData) => {
      // Compare GPA to min/max
      const passesGPACheck = this.minGPA <= applicant.GPA && applicant.GPA <= this.maxGPA;
      //Calls checkAnswers to filter students by the answers the faculty has selected
      const passesQuestionsCheck = this.checkAnswers(applicant.questions);
      // Only pass this student if it passes the GPA check
      return passesGPACheck && passesQuestionsCheck;
    });

    // Set the new data (update table)
    this.dataSource.data =this.filteredApplicantsData;
  }

  //This method fetches the applicants and then updates the shared applicants data, if it is able to get the projectID from the 
  //table data sharing service, then it grabs the applicants and sets the datasource to the object returned
  fetchApplicants() {
    this.getStudentApplicants().subscribe({
      next: (applicantData: ApplicantData[]) => {
        this.allApplicantsData = applicantData;
        this.applyCustomFilters();
      },
    });
  }

  //This code is used for the question filtering by faculty. What happens is the faculty can move through each of their questions and provide their
  //answers to the questions. Then the applied students table is filtered to only include students whose responses match their own.  
  // questions: string[] = []; // This array stores the questions from the application, it is created to make the accessing of the question string easier in the html
  currentQuestionIndex: number // = 0; //This number is the current index for the question array, it exists to make the accessing of a particular element of the arrays easier in the html
  currentQuestionType: string; //= ""; //This string stores the current question type, this lets the html know which question to load.
  currentQuestion: string; // = this.questions[this.currentQuestionIndex].question; //This string holds the current question of the questions array
  facultyAnswers: any[] = []; //This array stores the faculty's choices for their questions, and is used to filter the students based on their answers compared to the faculty's

  previousQuestion() { //This method moves the question card in the html to its previous question
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex].question;
      this.currentQuestionType = this.questions[this.currentQuestionIndex].requirementType;
    }
  }

  nextQuestion() { //This method moves the question card to the next question
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex].question;
      this.currentQuestionType = this.questions[this.currentQuestionIndex].requirementType;
    }
  }

  checkAnswers(studentQuestions: any) { //This method checks to see if the questions provided by the faculty match the student parameter's questions
    for (let x = 0; x < this.facultyAnswers.length; x++) { //iterate through all faculty answers
      if (this.questions[x].requirementType === "radio button") { //check if the requirement is radio button, if so ensure the choices are equal
        if (this.facultyAnswers[x] != "" && this.facultyAnswers[x] != studentQuestions[x].answers[0]) {
          return false;
        }
      } else if (this.questions[x].requirementType === "check box") { //check if the requirement is check box, if so, ensure the student response has all the faculty choices
        if (!this.facultyAnswers[x].every((element: any) => studentQuestions[x].answers.includes(element))) {
          return false;
        }
      } else if (this.questions[x].requirementType === "text") { //check if the requirement is text, if so then check that the input string matches the text body
        if (this.facultyAnswers[x] != "" && !studentQuestions[x].answers[0].includes(this.facultyAnswers[x])) {
          return false;
        }
      }
    }
    return true; //if the code reaches here, then the check passed for all questions
  }
  //this method updates the faculty answer for a text response then updates the table
  updateTextAnswer(event: any) {
    const inputValue = event?.target?.value;
    if (inputValue !== undefined) {
      this.facultyAnswers[this.currentQuestionIndex] = inputValue;
      this.applyCustomFilters();
    }
  }
  //this method updates the choices for check box or radio button, then updates the table
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
  //this method should remove the selection of a radio button (is currently not implemented)
  removeSelection() {
    this.facultyAnswers[this.currentQuestionIndex] = "";
  }
  //this method resets all choices for the faculty answers, either to a new, empty array for check boxes or an empty string for radio buttons and text
  //then it updates the table to reset the applicants
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

  back() {
    // Send the user back!
    this.location.back();
  }
} 
