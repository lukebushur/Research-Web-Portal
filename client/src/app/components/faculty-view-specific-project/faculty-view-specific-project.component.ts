import { Component } from '@angular/core';
import { FacultyProjectService } from 'src/app/controllers/faculty-project-controller/faculty-project.service';
import { ActivatedRoute } from '@angular/router';
import { DateConverterService } from 'src/app/controllers/date-converter-controller/date-converter.service';
import { SearchProjectService } from 'src/app/controllers/search-project-controller/search-project.service';
import { SearchOptions } from 'src/app/_models/searchOptions';

@Component({
  selector: 'app-faculty-view-specific-project',
  templateUrl: './faculty-view-specific-project.component.html',
  styleUrls: ['./faculty-view-specific-project.component.css']
})
export class FacultyViewSpecificProjectComponent {

  projectID: string = "";
  projectType: string = "";
  responseData: any = -1; //the object that will store the response data
  posted: String;
  deadline: String;

  constructor(private facultyService: FacultyProjectService, private route: ActivatedRoute, private dateConverter: DateConverterService,) {
    this.route.params.subscribe(params => {
      this.projectID = params['projectID'];
      this.projectType = params['projectType'];
    });
  }

  ngOnInit(): void {
    this.facultyService.getProject(this.projectID, this.projectType).subscribe({
      next: (data) => {
        this.responseData = data.success.responseData;
        this.posted = this.dateConverter.convertDate(this.responseData.projectData.posted);
        this.deadline = this.dateConverter.convertDate(this.responseData.projectData.deadline);

        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
    });
  }


}
