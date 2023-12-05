import { HttpClient, HttpRequest } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FacultyProjectService } from '../_helpers/faculty-project-service/faculty-project.service';

@Component({
  selector: 'apply-faculty-dashboard',
  templateUrl: './accept.component.html',
})
export class FacultyDashboardApplyComponent implements OnInit {
  projects: Array<{
    student: string;
  }> = [];

  projectId: string = "";
  href: string = "";

  projectData: Array<any> = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params["project"];
      this.update();
      setInterval(() => {
        this.update();
      }, 30 * 1000)
    })
  }

  accept(app: any) {
    console.log(app);
  }

  deny(app: any) {
    console.log(app);
  }

  update(): void {
    this.controller.getProjects().subscribe({
      next: (data) => {
        this.projectData = data?.success?.activeProjects?.projects;
        if (this.projectData) {
          const projectWereLookingFor = this.projectData.find(project => project._id == this.projectId);
          if (projectWereLookingFor) {
            this.projects = projectWereLookingFor.applications.map((application: { name: any; _id: any }) => {
              return {
                student: application.name,
                _id: application._id
              }
            })
          }
        }
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      }
  })
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private controller: FacultyProjectService) { }
}
