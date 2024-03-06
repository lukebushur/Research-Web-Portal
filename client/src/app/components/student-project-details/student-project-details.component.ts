import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchProjectService } from 'src/app/controllers/search-project-controller/search-project.service';
import { StudentDashboardService } from 'src/app/controllers/student-dashboard-controller/student-dashboard.service';

@Component({
  selector: 'app-student-project-details',
  templateUrl: './student-project-details.component.html',
  styleUrls: ['./student-project-details.component.css']
})
export class StudentProjectDetailsComponent {

  //Variables
  projectID: String; 
  studentID: String;
  responseData: any = -1; 
  answersArray: any[];
  studentDashboardService: StudentDashboardService;

  //Constructor
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.projectID = params['projectID'];
    });
  }

  //onInit
  onInit() {
    this.getStudentInfo();
    this.getApplication();
  }

  //getStudent info
  getStudentInfo(): void {
    this.studentDashboardService.getStudentInfo().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.studentID = data.success.accountData.id;
        }
      },
      error: (data: any) => {
        console.log('Error', data);
      },
    });
  }

  getApplication() {

  }
}
