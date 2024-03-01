import { Component, ComponentRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CatergoryFieldComponent } from './catergory-field/catergory-field.component';
import { FieldComponent } from './custom-field-modal/field.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomFieldDialogue } from './custom-field-modal/modal.component';
import { PostCreationService } from 'src/app/controllers/post-creation-controller/post-creation.service';
import { CustomQuestionComponent } from './custom-question/custom-question.component';
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service'


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostProjectComponent implements AfterViewInit {
  title: string | null = ""; //Title of the project
  description: string | null = ""; //Description of the project
  responsibilities: string | null = "";
  gpa: Number | null = 3;
  standing: string | null = "";
  fileName: string = "";
  deadline: Date;
  requirementsType: number = -1; //0 for website requirement creation, 1 for file requirements, 2 for a combination 
  categoriesArr: String[] = []; //The array of categories for the research posting
  projectID: any; //The id for the project, grabbed through the URL parameter
  projectData: any;
  projectType: string;

  //These arrays are used to store the multiple components of major, question or categories.
  categoryObjects: Array<ComponentRef<CatergoryFieldComponent>> = [];
  majorObjects: Array<ComponentRef<CatergoryFieldComponent>> = [];
  customQuestionsObjects: Array<ComponentRef<CustomQuestionComponent>> = [];

  //These three are used to access the html and place the new major, question, or category fields in the html
  @ViewChild('categories', { read: ViewContainerRef })
  categories!: ViewContainerRef;
  @ViewChild('customQuestions', { read: ViewContainerRef })
  customQuestions!: ViewContainerRef;
  @ViewChild('majors', { read: ViewContainerRef })
  majors!: ViewContainerRef;

  exampleData: Array<{ name: string }> = [
    {
      name: 'Computer Science',
    },
    {
      name: 'Engineering'
    }
  ]

  exampleData2: Array<{ name: string, instructions: string }> = [
    {
      name: 'Question 1',
      instructions: "Please beg on your knees why you want this"
    },
    {
      name: "Question 2",
      instructions: 'Backend or Frontend?'
    }
  ]

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog, private facultyProjectService: FacultyProjectService,
    private postCreationService: PostCreationService, private route: ActivatedRoute) {
  }


  //This is required to implement the afterViewInit() interface
  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.projectID = params['projectID'];
      this.projectType = params['projectType'];
      if (this.projectID.length === 24) { //MongoDB ids are of length 24
        this.facultyProjectService.getProject(this.projectID, this.projectType).subscribe({
          next: (data) => {
            const project = data.success.project;
            this.requirementsType = 0;
            //These lines set the project obj to the data retrieved from the request, then assigns the variables that are used in ngModel 
            //to the data obtained from the request.
            this.title = project.projectName;
            this.gpa = project.GPA;
            this.description = project.description;
            this.deadline = new Date(project.deadline); //deadline doesn't update so we need to fix it lol
            console.log(this.deadline);
            this.responsibilities = project.responsibilities;
            //Creates the major categories from the array obtained from the data
            setTimeout(() => {
              project.majors.forEach((major: string) => {
                this.createNewCategory(major, true) //creates a new major element using the method
              });
              //Creates the category from the array obtained from the category field
              project.categories.forEach((category: string) => {
                this.createNewCategory(category, false);
              });

              project.questions.forEach((question: any) => {
                const newQuestion = this.customQuestions.createComponent(CustomQuestionComponent);

                //set the type and question values of the component
                newQuestion.instance.typeStr = question.requirementType;
                newQuestion.instance.questionStr = question.question;
                newQuestion.instance.isRequired = question.required;
                newQuestion.instance.choices = question.choices;

                this.customQuestionsObjects.push(newQuestion); //push the new question to the array

                newQuestion.instance.deleted.subscribe(() => { //set the on delete to remove the component from the array.
                  let index = this.customQuestionsObjects.indexOf(newQuestion);
                  if (index > -1) {
                    this.customQuestionsObjects.splice(index, 1);
                    newQuestion.destroy();
                  }
                })
              });
            }, 1000);

          },
          error: (error) => {
            this.projectID = null;
          }
        })
      } else { this.projectID = null; }
    })
  }

  //This method is used to handle the opening of dialog boxes, which is used to specify the question and question type when creating questions
  openDialog(): void {
    const dialogRef = this.dialog.open(CustomFieldDialogue, { //opens the dialog box
      data: { type: 'option', fieldName: '' },
    });

    //after the dialog is closed, it then creates a new question component if the create button is selected
    dialogRef.afterClosed().subscribe(result => {
      if (result.create) { //check if the question show be created
        console.log(result.type);

        const question = this.customQuestions.createComponent(CustomQuestionComponent);

        //set the type and question values of the component
        question.instance.typeStr = result.type;
        question.instance.questionStr = result.question;
        this.customQuestionsObjects.push(question); //push the new question to the array

        question.instance.deleted.subscribe(() => { //set the on delete to remove the component from the array.
          let index = this.customQuestionsObjects.indexOf(question);
          if (index > -1) {
            this.customQuestionsObjects.splice(index, 1);
            question.destroy();
          }
        })
      }
    });
  }


  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      const upload$ = this.http.post("/api/thumbnail-upload", formData);

      upload$.subscribe();
    }
  }

  //This method is just used to prepare the data for form submission to create a new project
  onSubmit() {

    this.postCreationService.createPost(this.getSubmissionData("Active")) //make the request to create the project
      .subscribe((response: any) => {
        this.router.navigate(['/faculty/dashboard']);
      }, (error: any) => {
        console.error('Registration failed.', error);
      });
  };
  //This method is used to save a draft and accesses the updateProject route
  saveProject() {
    let data = this.getSubmissionData(this.projectType);
    data.projectID = this.projectID;
    this.facultyProjectService.updateProject(data) //make the request to create the project
      .subscribe((response: any) => {
        this.router.navigate(['/faculty/dashboard']);
      }, (error: any) => {
        console.error('Registration failed.', error);
      });
  };
  //This method is very similar to the onsubmit, but creates a draft instead of a new active project
  createDraft() {
    this.postCreationService.createPost(this.getSubmissionData("Draft")) //make the request to create the project
      .subscribe((response: any) => {
        this.router.navigate(['/faculty/dashboard']);
      }, (error: any) => {
        console.error('Registration failed.', error);
      });
  }
  //This help method sets up the data necessary for onSubmit, createDraft, or saveDraft as each of these methods make a request
  //to updateProject or create project which both have very similar request bodies.
  getSubmissionData(projectType: string): any {
    //Grabs the values from the arrays of components
    const categoriesValues = this.categoryObjects.map(category => category.instance.getValue()); //grabs category values
    const majorsValues = this.majorObjects.map(major => major.instance.getValue()); //grabs major values
    console.log(majorsValues);
    const customQuestionValues = this.customQuestionsObjects.map(question => question.instance.getData()); //puts questions into an array
    let questions: any = [];
    //the above questions array is used to store the questions, which need to be in a particular format to ensure the request is valid
    customQuestionValues.forEach(question => { //This block of code creates an object then populates its properties with the field needed for the request 
      let obj: any = {};
      obj = {
        requirementType: question.type,
        required: question.required,
        question: question.question,
      }
      if (question.choices)
        obj.choices = question.choices;

      questions.push(obj); //push the created object in the questions array
    });

    const data: any = { //sets up all the required data for the request 
      projectType: projectType,
      projectDetails: {
        project: {
          projectName: this.title,
          deadline: this.deadline,
          description: this.description,
          GPA: this.gpa,
          majors: majorsValues,
          categories: categoriesValues,
          questions: questions
        }
      }
    };

    if (this.responsibilities) { data.responsibilities = this.responsibilities };
    return data;
  }

  //This method creates a new field, either for the project categories or the applicable majors for the project.
  //Currently, it takes two parameters: name, a string, which will be the initial text of the field. and major, a boolean, which is 
  //true if the field will be for majors and false otherwise. Might change that to a string if additional fields are required.
  createNewCategory(name: string, major: boolean) {
    if (!major) { //These blocks of code are nearly identical, they each create a new componenet and add it to the array of componenets, 
      const category = this.categories.createComponent(CatergoryFieldComponent);
      category.instance.type = "category";
      category.instance.value = name;
      this.categoryObjects.push(category);
      category.instance.deleted.subscribe(() => { //On delete of the component, remove it from the array
        let index = this.categoryObjects.indexOf(category); //find its index
        if (index > -1) { //if it is in the array, then remove it
          this.categoryObjects.splice(index, 1);
          category.destroy();
        }
      })
    } else {
      const major = this.majors.createComponent(CatergoryFieldComponent);
      major.instance.type = "majors";
      major.instance.value = name;
      this.majorObjects.push(major);
      major.instance.deleted.subscribe(() => {
        let index = this.majorObjects.indexOf(major);
        if (index > -1) {
          this.categoryObjects.splice(index, 1);
          major.destroy();
        }
      })
    }
  }
}
