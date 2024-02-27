import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ViewApplicationComponent } from './view-application.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ViewApplicationComponent', () => {
  let component: ViewApplicationComponent;
  let fixture: ComponentFixture<ViewApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewApplicationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule,],
    });
    fixture = TestBed.createComponent(ViewApplicationComponent);
    component = fixture.componentInstance;
    component.responseData = {
      "responseData": {
        "applicantData": {
          "status": "Accept",
          "name": "Matthew Im",
          "GPA": 3.5,
          "major": [
            "Computer Science",
            "Music"
          ],
          "email": "uaaaaadddent@gmail.com",
          "appliedDate": "2024-02-23T01:57:57.580Z",
          "answers": [
            {
              "question": "Can you eat frogs?",
              "requirementType": "radio button",
              "required": true,
              "choices": [
                "Yes, I can eat frogs!",
                "No, I cannot eat frogs!"
              ],
              "answers": [
                "Yes, I can eat frogs!"
              ]
            },
            {
              "question": "Write a 3-page paper on why baby shark is the best song ever.",
              "requirementType": "text",
              "required": true,
              "answers": [
                "This is 3 pages if the font is size 900."
              ]
            },
            {
              "question": "Frogs?",
              "requirementType": "check box",
              "required": true,
              "choices": [
                "Frogs",
                "frogs"
              ],
              "answers": [
                "Frogs",
                "frogs"
              ]
            }
          ],
          "application": "65d7fba5b3dbd26dc4a51e34"
        },
        "projectData": {
          "projectName": "Temp",
          "posted": "2024-02-20T02:14:04.446Z",
          "deadline": "2024-06-18T04:00:00.000Z",
          "description": "Test",
          "questions": [
            {
              "question": "Can you eat frogs?",
              "requirementType": "radio button",
              "required": true,
              "choices": [
                "Yes, I can eat frogs!",
                "No, I cannot eat frogs!"
              ]
            },
            {
              "question": "Write a 3-page paper on why baby shark is the best song ever.",
              "requirementType": "text",
              "required": true
            },
            {
              "question": "Frogs?",
              "requirementType": "check box",
              "required": true,
              "choices": [
                "Frogs",
                "frogs"
              ]
            }
          ],
          "GPA": 3,
          "majors": [
            "Computer Science"
          ],
          "categories": [
            "Bioinformatics",
            "Computer Science",
            "Biology"
          ]
        }
      }
    }
    component.posted = "2/19/2024 9:09:52 PM";
    fixture.detectChanges();
  });
});
