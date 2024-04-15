import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { AuthService } from 'src/app/controllers/auth-controller/auth.service';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
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

//Interface for an entries to the applied student table
export interface DetailedAppliedStudentList {
  questions: any[];
  name: string;
  email: string;
  GPA: number;
  majors: string;
  status: string;
  application: Date;
}

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css'],
  standalone: true,
  imports: [
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
    MatButtonModule,
    SpinnerComponent,
    MatCardModule
  ]
})

export class ViewProjectComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'email', 'GPA', 'majors', 'status']; //This array determines the displayedd columns in the table
  projectID: string = ""; //projectID, grabbed from the url parameters and used in requests
  projectType: string = ""; //projectType, grabbed from the url parameter and used in requests
  projectName: string = ""; //Project Name
  projectData: any = -1; // The object that will store the data of the project from the getProject route, set in the constructor
  studentData: DetailedAppliedStudentList[] = []; //This array contains the student data for the table
  filteredData: DetailedAppliedStudentList[] | null = null; //This array contains the filtered data from the student list
  dataSource = new MatTableDataSource(this.studentData); //This object is used for the material table data source to allow for the table to work/sort etc
  posted: String; // The string that holds the date the project was posted on
  deadline: String; // the string that is the deadline of the project

  // Applicant data filter variables
  tableFilter: string = '';
  minGPA: number = 0;
  maxGPA: number = 4;

  // Student related information
  // We need to store the professors email
  isStudent: boolean = true;
  professorEmail: string = "";

  accountType: number;

  constructor(
    private route: ActivatedRoute,
    private navRouter: Router,
    private facultyService: FacultyProjectService,
    private studentService: StudentDashboardService,
    private dateConverter: DateConverterService,
    private _liveAnnouncer: LiveAnnouncer,
    private authService: AuthService,
    private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      let projectFetchInformation;
      this.projectID = params['projectID'];

      // We're going to assume project-type means they're coming from
      // Faculty dashboard
      const accountInfo = this.authService.getAccountInfo();
      const authResponse = await firstValueFrom(accountInfo);
      this.accountType = authResponse?.success?.accountData?.userType;

      this.isStudent = this.accountType == environment.studentType

      if (!this.isStudent) {
        this.projectType = params['projectType'];
        projectFetchInformation = this.facultyService.getProject(this.projectID, this.projectType)
      } else {
        // Now we're going to assume this is just the student dashboard viewing a project
        this.projectType = "active";
        // Convert from Base64 so it looks prettier in the URL
        this.professorEmail = atob(params['projectEmail'] || "");
        projectFetchInformation = this.studentService.getProjectInfo(this.professorEmail, this.projectID)
      }
      //grab projectID from url parameter
      //Get project data from database, this only grabs the project name currently, but if more information is need it will exist in the data variable below
      projectFetchInformation.subscribe({
        next: (data) => {
          this.projectName = data.success.project.projectName; //Grabs project name from request
          this.projectData = data.success.project; //stores project data from request into project data variable
          this.questions = this.projectData.questions; //This stores the questions from the project data into the questions array, used in the question filtering
          this.currentQuestionType = this.projectData.questions[0].requirementType; //sets the intial requirement type, used in the question filtering
          this.facultyAnswers = [this.projectData.questions.length]; //stores the faculty answers, used in the question filtering

          for (let x = 0; x < this.projectData.questions.length; x++) { //This sets up the faculty answers array, either a string for text and radio button questions, or an array for check boxes
            if (this.projectData.questions[x].requirementType === "check box") { //this is used in the question filtering 
              this.facultyAnswers[x] = []
            } else {
              this.facultyAnswers[x] = "";
            }
          }
          this.posted = this.dateConverter.convertShortDate(this.projectData.posted); //get the string for the posted variable
          this.deadline = this.dateConverter.convertShortDate(this.projectData.deadline); //get the string for the deadlien variable
        },
        error: (error) => {
          console.error('Error fetching projects', error);
        },
      });
      //Get application data from database
      if (!this.isStudent) {
        // Student doesn't have authorization from server to view this data
        // So we're going to skip it if they are a student!
        this.facultyService.detailedFetchApplicants(this.projectID).subscribe({
          next: (data) => {
            let dataWrapper = data.success.applicants.map((applicant: any) => {
              let majorsStr = applicant.majors[0];
              for (let i = 1; i < applicant.majors.length; i++) {
                majorsStr += ', ' + applicant.majors[i];
              }
              return {
                ...applicant,
                majors: majorsStr,
              };
            }); //data wrapper to hold a subset of the request's response information
            dataWrapper.forEach((x: { project: string; }) => {
              x.project = this.projectID; //add a field to each element of the data
            });
            this.studentData = dataWrapper; //sets the student's data to each the warpper

            // this.dataSource = new MatTableDataSource(this.studentData); //set up the datasource for the mat table
            this.updateTable();
            this.dataSource.sort = this.sort; //set up the sorting for the table
          },
          error: (error) => {
            console.error('Error fetching projects', error);
          }
        })
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
  }

  formatGPA(): string {
    return (Math.round(this.projectData.GPA * 100) / 100).toFixed(2);
  }

  back() {
    // Send the user back!
    this.location.back();
  }

  apply() {
    this.navRouter.navigate(['/student/apply-to-project'], {
      queryParams: {
        profName: this.projectData.projectName,
        profEmail: this.professorEmail,
        oppId: this.projectID,
      }
    });
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
    this.facultyService.applicationDecide(app, this.projectID, decision).subscribe({
      next: (data) => {
        this.fetchApplicants();
      },
    });
  }
  //method to update the table of applied students based upon the filters
  updateTable() {
    this.filteredData = this.studentData.filter((student) => {
      // Compare GPA to min/max
      const passesGPACheck = this.minGPA <= student.GPA && student.GPA <= this.maxGPA;
      //Calls checkAnswers to filter students by the answers the faculty has selected
      const passesQuestionsCheck = this.checkAnswers(student.questions);

      // Only pass this student if it passes the GPA check
      return passesGPACheck && passesQuestionsCheck;
    })

    // Set the new data (update table)
    this.dataSource = new MatTableDataSource(this.filteredData);
    this.dataSource.filter = this.tableFilter.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  //This method fetches the applicants and then updates the shared applicants data, if it is able to get the projectID from the 
  //table data sharing service, then it grabs the applicants and sets the datasource to the object returned
  fetchApplicants() {
    this.facultyService.detailedFetchApplicants(this.projectID).subscribe({
      next: (data) => {
        let dataWrapper = data.success.applicants;
        dataWrapper.forEach((x: { project: string; }) => {
          x.project = this.projectID;
        });
        this.studentData = dataWrapper;
        // this.dataSource = new MatTableDataSource(this.studentData);
        this.updateTable();
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      }
    })
  }
  //This code is used for the question filtering by faculty. What happens is the faculty can move through each of their questions and provide their
  //answers to the questions. Then the applied students table is filtered to only include students whose responses match their own.  
  questions: string[] = []; // This array stores the questions from the application, it is created to make the accessing of the question string easier in the html
  currentQuestionIndex: number = 0; //This number is the current index for the question array, it exists to make the accessing of a particular element of the arrays easier in the html
  currentQuestionType: string = ""; //This string stores the current question type, this lets the html know which question to load.
  currentQuestion: string = this.questions[this.currentQuestionIndex]; //This string holds the current question of the questions array
  facultyAnswers: any[] = []; //This array stores the faculty's choices for their questions, and is used to filter the students based on their answers compared to the faculty's


  previousQuestion() { //This method moves the question card in the html to its previous question
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.currentQuestionType = this.projectData.questions[this.currentQuestionIndex].requirementType
    }
  }

  nextQuestion() { //This method moves the question card to the next question
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex]
      this.currentQuestionType = this.projectData.questions[this.currentQuestionIndex].requirementType
    }
  }

  checkAnswers(studentQuestions: any) { //This method checks to see if the questions provided by the faculty match the student parameter's questions
    for (let x = 0; x < this.facultyAnswers.length; x++) { //iterate through all faculty answers
      if (this.projectData.questions[x].requirementType === "radio button") { //check if the requirement is radio button, if so ensure the choices are equal
        if (this.facultyAnswers[x] != "" && this.facultyAnswers[x] != studentQuestions[x].answers[0]) { return false; }
      } else if (this.projectData.questions[x].requirementType === "check box") { //check if the requirement is check box, if so, ensure the student response has all the faculty choices
        if (!this.facultyAnswers[x].every((element: any) => studentQuestions[x].answers.includes(element))) { return false; }
      } else if (this.projectData.questions[x].requirementType === "text") { //check if the requirement is text, if so then check that the input string matches the text body
        if (this.facultyAnswers[x] != "" && !this.facultyAnswers[x].includes(studentQuestions[x].answers[0])) { return false; }
      }
    }
    return true; //if the code reaches here, then the check passed for all questions
  }
  //this method updates the faculty answer for a text response then updates the table
  updateTextAnswer(event: any) {
    const inputValue = event?.target?.value;
    if (inputValue !== undefined) {
      this.facultyAnswers[this.currentQuestionIndex] = inputValue;
      this.updateTable();
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
    this.updateTable();
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
    this.updateTable();
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
