import { Component, ComponentRef, ViewChild, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CategoryComponent } from './category-widget/category.component';
import { FieldComponent } from './custom-field-modal/field.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomFieldDialogue } from './custom-field-modal/modal.component';
import { CustomRequirementCreator } from './dialog-custom-field/category.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
})
export class PostProjectComponent implements AfterViewInit {
  title: string | null = "";
  description: string | null  = ""; 
  responsibilities: string | null  = ""; 
  gpa: Number | null  = 3;
  major: string | null  = "";
  standing: string | null  = "";
  miscExperience: string | null  = "";
  url: string = `${environment.ipUrl}/api/projects/createProject`;
  fileName: string = "";
  dateTime: Date = new Date();

  isPaid: boolean = true;
  needsExperience: boolean = true;

  @ViewChild('categories', {read: ViewContainerRef})
  categories!: ViewContainerRef;

  @ViewChild('customFieldsPage2', {read: ViewContainerRef})
  customFields!: ViewContainerRef;

  @ViewChild('customRequirements', {read: ViewContainerRef})
  customRequirements!: ViewContainerRef;

  exampleData: Array<{name: string}> = [
    {
      name: 'Computer Science',
    },
    {
      name: 'Engineering'
    }
  ]

  exampleData2: Array<{name: string, instructions: string}> = [
    {
      name: 'Question 1',
      instructions: "Please beg on your knees why you want this"
    },
    {
      name: "Question 2",
      instructions: 'Backend or Frontend?'
    }
  ]

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {
    
  }

  ngAfterViewInit() : void {
    // this.exampleData.forEach(val => {
    //   this.createNewCategory(val.name);
    // });
    // this.exampleData2.forEach(val => {
    //   this.addCustomField(val.name, val.instructions)
    // })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomFieldDialogue, {
      data: {type: 'option', fieldName: 'name'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewRequirement(result.fieldName, result.type == 'text')
      }
    });
  }

  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.http.post("/api/thumbnail-upload", formData);

        upload$.subscribe();
    }
  }

  categoryObjects: Array<ComponentRef<CategoryComponent>> = [];
  customFieldObjects: Array<ComponentRef<FieldComponent>> = [];
  customRequirementObjects: Array<ComponentRef<CustomRequirementCreator>> = [];

  onSubmit() {
    const data = {
      projectType: "Active",
      professorEmail: "N/A",
      projectDetails: {
        project: {
          projectName: this.title,
          posted: Date.now(),
          description: this.description,
          questions: this.customFieldObjects.map(comp => {
            return [
              comp.instance.fieldName,
              comp.instance.fieldInstructions
            ]
          }),
          requirements: this.customRequirementObjects.map(inst => {
            return {
              requirementType: inst.instance.isText ? 1 : 2,
              requirementValue: inst.instance.fieldName,
              required: true // TODO
            }
          })
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

    this.http.post(this.url, data)
      .subscribe((response: any) => {
        console.log('Project creation successful!', response);

        this.router.navigate(['/home']);
      }, (error: any) => {
        console.error('Registration failed.', error);
      });
  };

  updateFieldNames() : void {
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

  createNewRequirement(name: string, isText: boolean) {
    const category = this.customRequirements.createComponent(CustomRequirementCreator);
    //category.setInput('fieldName', name != null ? name : "");
    //category.setInput('isText', isText);
    category.instance.fieldName = name != null ? name : "";
    category.instance.isText = isText;
    this.customRequirementObjects.push(category);
    category.instance.deleted.subscribe(() => {
      let index = this.customRequirementObjects.indexOf(category);
      if (index > -1) {
        this.customRequirementObjects.splice(index, 1);
        category.destroy();
      }
    })
  }

  createNewCategory(name: string | null) {
    const category = this.categories.createComponent(CategoryComponent);
    category.setInput('name', name != null ? name : "");
    this.categoryObjects.push(category);
    category.instance.deleted.subscribe(() => {
      let index = this.categoryObjects.indexOf(category);
      if (index > -1) {
        this.categoryObjects.splice(index, 1);
        category.destroy();
      }
    })
  }
}
