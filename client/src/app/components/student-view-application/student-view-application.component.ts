import { Component } from '@angular/core';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';

@Component({
  selector: 'app-student-view-application',
  templateUrl: './student-view-application.component.html',
  styleUrls: ['./student-view-application.component.css']
})
export class StudentViewApplicationComponent {

  applicantionID: string;
  applicationData: any = -1;
  answersArray: any[];

  posted: String;
  deadline: String;
  appliedDate: String;


  constructor(private studentService: StudentDashboardService, private route: ActivatedRoute, private dateConverter: DateConverterService,) {
    this.route.params.subscribe(params => {
      this.applicantionID = params['applicationID'];
    });
  }

  ngOnInit(): void {
    this.studentService.getApplication(this.applicantionID).subscribe({
      next: (data) => {
        this.applicationData = data.success.application;
        this.appliedDate = this.dateConverter.convertDate(this.applicationData.appliedDate);    
      }
    })
  }
}
