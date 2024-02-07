import { Component, ComponentRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CatergoryFieldComponent } from './catergory-field/catergory-field.component';
import { FieldComponent } from './custom-field-modal/field.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomFieldDialogue } from './custom-field-modal/modal.component';
import { PostCreationService } from 'src/app/controllers/post-creation-controller/post-creation.service';
import { CustomQuestionComponent } from './custom-question/custom-question.component';


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
  deadline: Date = new Date();
  requirementsType: number = 0; //0 for website requirement creation, 1 for file requirements, 2 for a combination 
  categoriesArr: String[] = []; //The array of categories for the research posting

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

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog, private postCreationService: PostCreationService) {

  }

  //This is required to implement the afterViewInit() interface
  ngAfterViewInit(): void {
    // Commented to pass tests
    // TODO: implement this method
    // throw new Error('Method not implemented.');
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
    //Grabs the values from the arrays of components
    const categoriesValues = this.categoryObjects.map(category => category.instance.getValue()); //grabs category values
    const majorsValues = this.majorObjects.map(major => major.instance.getValue()); //grabs major values
    const customQuestionValues = this.customQuestionsObjects.map(question => question.instance.getData()); //puts questions into an array
    let questions: any = [];
    //the above questions array is used to store the questions, which need to be in a particular format to ensure the request is valid
    customQuestionValues.forEach(question => { //This block of code creates an object then populates its properties with the field needed for the request 
      let obj: any = {}
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
      projectType: "Active",
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

    this.postCreationService.createPost(data) //make the request to create the project
      .subscribe((response: any) => {
        console.log('Project creation successful!', response);

        this.router.navigate(['/faculty-dashboard']);
      }, (error: any) => {
        console.error('Registration failed.', error);
      });
  };

  //This method creates a new field, either for the project categories or the applicable majors for the project.
  //Currently, it takes two parameters: name, a string, which will be the initial text of the field. and major, a boolean, which is 
  //true if the field will be for majors and false otherwise. Might change that to a string if additional fields are required.
  createNewCategory(name: string | null, major: boolean) {
    if (!major) { //These blocks of code are nearly identical, they each create a new componenet and add it to the array of componenets, 
      const category = this.categories.createComponent(CatergoryFieldComponent);
      category.instance.type = "category";
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
      this.categoryObjects.push(major);
      major.instance.deleted.subscribe(() => {
        let index = this.categoryObjects.indexOf(major);
        if (index > -1) {
          this.categoryObjects.splice(index, 1);
          major.destroy();
        }
      })
    }
  }
}
