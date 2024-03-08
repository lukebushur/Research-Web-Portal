import { Component } from '@angular/core';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-student-view-application',
  templateUrl: './student-view-application.component.html',
  styleUrls: ['./student-view-application.component.css']
})
export class StudentViewApplicationComponent {

  applicationID: string;
  applicationData: any = -1;
  projectInfo: any = -1;
  answersArray: any[] = [];

  posted: String;
  deadline: String;
  appliedDate: String;


  constructor(private studentService: StudentDashboardService, private route: ActivatedRoute, private dateConverter: DateConverterService,
    private router: Router) {
    this.route.params.subscribe(params => {
      this.applicationID = params['applicationID'];
    });
  }

  ngOnInit(): void {
    this.studentService.getApplication(this.applicationID).subscribe({
      next: (data) => {
        this.studentService.getProjectInfo(data.success.application.professorEmail, data.success.application.opportunityId).subscribe({
          next: (data1) => {
            this.projectInfo = data1.success.project;
            console.log(this.projectInfo);
            this.deadline = this.dateConverter.convertShortDate(this.projectInfo.deadline);
            this.posted = this.dateConverter.convertShortDate(this.projectInfo.posted);
          },
          error: (error) => {
            this.projectInfo = null;
            this.router.navigate(['/studentApplicationOverview'], {
            });
          }
        })


        this.applicationData = data.success.application;
        this.appliedDate = this.dateConverter.convertShortDate(this.applicationData.appliedDate);

        for (let i = 0; i < this.applicationData.questions.length; i++) {
          if (this.applicationData.questions[i].requirementType == "text") {
            this.answersArray.push(this.applicationData.questions[i].answers[0]);
          } else {
            let tempArr = [];
            for (let j = 0; j < this.applicationData.questions[i].choices.length; j++) {
              tempArr.push({
                question: this.applicationData.questions[i].choices[j],
                answer: this.getChoice(this.applicationData.questions[i], j)
              });
            }
            this.answersArray.push(tempArr);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching projects', error);
        this.router.navigate(['/studentApplicationOverview'], {
        });
      },
    })
  }

  getChoice(answer: any, index: number) {
    let index1 = answer.answers.findIndex((element: string) => element == answer.choices[index]);
    if (index1 !== -1) { return true; }
    return false;
  }

  rescindApplication(applicationID: string) {
    this.studentService.deleteApplication(applicationID).subscribe({
      next: (data: any) => {
        this.router.navigate(['/studentApplicationOverview'], {
        });
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }
}
