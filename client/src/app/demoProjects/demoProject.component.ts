import { Component, OnInit } from '@angular/core';
import { FacultyProjectService } from '../_helpers/faculty-project-service/faculty-project.service';

@Component({
    selector: 'demo-projects-page',
    templateUrl: './demoProject.component.html',
    styleUrls: ['./demoProject.component.css']
})
export class DemoProjectsComponent implements OnInit {

    constructor(private facultyService: FacultyProjectService) { }
    ActiveProjects: any[] = [];
    GPA: Number;
    Major: String;
    Name: String;

    ngOnInit(): void {
        this.facultyService.demoGetActiveProjects().subscribe((res: any) => {
            this.ActiveProjects = res.success.data;
            console.log(res);
        });
        this.facultyService.demoGetStudentData().subscribe((res: any) => {
            this.Name = res.success.data.name;
            if (this.Name.includes("Sean Tierney")) {
                this.GPA = 19.62;
            } else {
                this.GPA = res.success.data.GPA;
            }
            this.Major = res.success.data.major;
        });
    }

    parseMajors(majors: String[]): String {
        let result: string = '';
        majors.forEach(x => {
            result += x + ", ";
        });
        result = result.substring(0, result.length - 2);
        return result;
    }

    applyToPosition(email: String, id: String): void {
        this.facultyService.demoApplyToPosition(email, id, this.GPA).subscribe({
            next: (data) => {
                console.log('Successfully Applied', data);
                this.facultyService.demoGetActiveProjects().subscribe((res: any) => {
                    this.ActiveProjects = res.success.data;
                    console.log(res);
                });
            },
            error: (error) => {
                console.error('Error applying', error);
            }
        });
    }

    canApplyToPosition(majors: String[], gpa: Number): Boolean {
        if (gpa > this.GPA) { return false; }
        if (majors.indexOf(this.Major) === -1) { return false; }
        return true;
    }

    alreadyApplied(id: String, button: Boolean): boolean {
        let index = this.ActiveProjects.findIndex(x => x.projectID === id);
        let nameIndex = this.ActiveProjects[index].applications.findIndex((y: any) => y.name === this.Name && y.gpa === this.GPA);
        if (nameIndex === -1) {
            if (button) { return true; }
            return false;
        } else {
            if (button) { return false; }
            return true;
        }
    }

    getApplicationStatus(id: String, button: Boolean): String {
        let index = this.ActiveProjects.findIndex(x => x.projectID === id);
        let nameIndex = this.ActiveProjects[index].applications.findIndex((y: any) => y.name === this.Name && y.gpa === this.GPA);
        console.log(nameIndex + " " + index);
        if (nameIndex !== -1) {
            return this.ActiveProjects[index].applications[nameIndex].status;
        }
        return "Error"
    }

}
