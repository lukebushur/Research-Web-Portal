import { Component, ComponentRef, ViewChild, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CatergoryFieldComponent } from './catergory-field/catergory-field.component';
import { FieldComponent } from './custom-field-modal/field.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomFieldDialogue } from './custom-field-modal/modal.component';
import { PostCreationService } from 'src/controllers/post-creation-controller/post-creation.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
})

export class PostProjectComponent implements AfterViewInit {
  title: string | null = "";
  description: string | null = "";
  responsibilities: string | null = "";
  gpa: Number | null = 3;
  majors: string[] | null = [];
  standing: string | null = "";
  miscExperience: string | null = "";
  fileName: string = "";
  deadline: Date = new Date();
  requirementsType: number = -1; //0 for website requirement creation, 1 for file requirements, 2 for a combination 
  categoriesArr : String[] = []; //The array of categories for the research posting

  categoryObjects: Array<ComponentRef<CatergoryFieldComponent>> = [];
  customFieldObjects: Array<ComponentRef<FieldComponent>> = [];

  @ViewChild('categories', { read: ViewContainerRef })
  categories!: ViewContainerRef;

  @ViewChild('customFieldsPage2', { read: ViewContainerRef })
  customFields!: ViewContainerRef;

  @ViewChild('customRequirements', { read: ViewContainerRef })
  customRequirements!: ViewContainerRef;

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

  ngAfterViewInit(): void { }

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomFieldDialogue, {
      data: { type: 'option', fieldName: '' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("1 " + result.question + " 2" + result.type);
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

  onSubmit() {
    //Grabs the values from the category componenets
    const categoriesValues = this.categoryObjects.map(category => category.instance.getValue());

    const data = {
      projectType: "Active",
      projectDetails: {
        project: {
          projectName: this.title,
          posted: new Date().toLocaleString(), //The toLocaleString() converts the date to the computer's local time settings
          deadline: this.deadline.toLocaleString(),
          description: this.description,
          gpa: this.gpa,
          categories: categoriesValues,
          majors: this.majors,
          questions: this.customFieldObjects.map(comp => {
            return [
              comp.instance.fieldName,
              comp.instance.fieldInstructions
            ]
          }),
        }
      }
    };

    // TODO
    // Handle Paid/Unpaid
    // Handle experience required
    // Handle optional categories
    // Handle Image
    // Handle Other Experience
    // Handle Deadline
    // Handle Responsibilities

    this.postCreationService.createPost(data)
      .subscribe((response: any) => {
        console.log('Project creation successful!', response);

        this.router.navigate(['/faculty-dashboard']);
      }, (error: any) => {
        console.error('Registration failed.', error);
      });
  };

  updateFieldNames(): void {
    let index: number = 1;
    this.customFieldObjects.forEach(comp => {
      comp.setInput("fieldName", `Question ${index++}`);
    })
  }

  addCustomField(name: string | null, instructions: string | null) {
    const category = this.customFields.createComponent(FieldComponent);
    category.instance.fieldName = name != null ? name : "";
    category.instance.fieldInstructions = instructions != null ? instructions : "";
    this.customFieldObjects.push(category);
    this.updateFieldNames();
    category.instance.deleted.subscribe(() => {
      let index = this.customFieldObjects.indexOf(category);
      if (index > -1) {
        this.customFieldObjects.splice(index, 1);
        category.destroy();
        this.updateFieldNames();
      }
    })
  }

  createNewCategory(name: string | null) {
    
    const category = this.categories.createComponent(CatergoryFieldComponent);
    this.categoryObjects.push(category);
    category.instance.deleted.subscribe(() => {
      let index = this.categoryObjects.indexOf(category);
      if (index > -1) {
        this.categoryObjects.splice(index, 1);
        category.destroy();
      }
    })
    console.log(this.categoryObjects);
  }
}
