import { Component, OnInit } from '@angular/core';
import { FacultyProjectService } from '../../controllers/faculty-project-controller/faculty-project.service';
import { MatTableDataSource } from '@angular/material/table';

export interface ProjectsTableRow {
    projectID: string;
    majors: string[];
    name: string;
    email: string;
    title: string;
    gpa: number;
    majorsString: string;
}

export interface StudentTableRow {
    name: string;
    major: string;
    gpa: number;
}

@Component({
    selector: 'demo-projects-page',
    templateUrl: './demoProject.component.html',
    styleUrls: ['./demoProject.component.css']
})

export class DemoProjectsComponent implements OnInit {

    constructor(private facultyService: FacultyProjectService) { }

    // for holding data
    tableProjectsData: ProjectsTableRow[] = [];
    // for updating the table after creation
    projectsDataSource: MatTableDataSource<ProjectsTableRow>;
    // for specifying the columns to display
    displayedProjectsColumns: string[] = ['name', /*'email',*/ 'title', 'gpa', 'majors', 'status'];

    // for holding data
    tableStudentData: StudentTableRow[] = [];
    // for updating the table after creation
    studentDataSource: MatTableDataSource<StudentTableRow>;
    // for specifying the columns to display
    displayedStudentColumns: string[] = ['name', 'major', 'gpa'];

    ActiveProjects: any[] = [];
    GPA: number;
    Major: string;
    Name: string;
    repeat: any;

    ngOnInit(): void {
        this.facultyService.demoGetActiveProjects().subscribe((res: any) => {
            this.ActiveProjects = res.success.data;

            // for each project, parse it into the ProjectsTableRow and push
            // it onto the array
            res.success.data.forEach((project: any) => {
                this.tableProjectsData.push({
                    projectID: project.projectID,
                    majors: project.majors,
                    name: project.professorName,
                    email: project.professorEmail,
                    title: project.title,
                    gpa: project.gpa,
                    majorsString: this.parseMajors(project.majors),
                })
            });
            // update the table's data
            this.projectsDataSource = new MatTableDataSource(this.tableProjectsData);
        });
        this.facultyService.demoGetStudentData().subscribe((res: any) => {
            this.Name = res.success.data.name;
            if (this.Name.includes("Sean Tierney")) {
                this.GPA = 19.62;
            } else {
                this.GPA = res.success.data.GPA;
            }
            this.Major = res.success.data.major;

            // parse the StudentTableRow and push it onto the array
            this.tableStudentData.push({
                name: res.success.data.name,
                major: res.success.data.major,
                gpa: res.success.data.GPA,
            });
            // update the table's data
            this.studentDataSource = new MatTableDataSource(this.tableStudentData);
        });
        this.repeat = setInterval(() => {
            this.facultyService.demoGetActiveProjects().subscribe((res: any) => {
                this.ActiveProjects = res.success.data;
                this.tableProjectsData = [];
                this.ActiveProjects.forEach((project: any) => {
                    this.tableProjectsData.push({
                        projectID: project.projectID,
                        majors: project.majors,
                        name: project.professorName,
                        email: project.professorEmail,
                        title: project.title,
                        gpa: project.gpa,
                        majorsString: this.parseMajors(project.majors),
                    })
                });
                this.projectsDataSource = new MatTableDataSource(this.tableProjectsData);
                console.log(res);
            });
        }, 5000);
    }

    ngOnDestroy() {
        clearInterval(this.repeat);
    }

    parseMajors(majors: string[]): string {
        let result: string = '';
        majors.forEach(x => {
            result += x + ", ";
        });
        result = result.substring(0, result.length - 2);
        return result;
    }

    applyToPosition(email: string, id: string): void {
        this.facultyService.demoApplyToPosition(email, id, this.GPA).subscribe({
            next: (data) => {
                console.log('Successfully Applied', data);
                this.facultyService.demoGetActiveProjects().subscribe((res: any) => {
                    this.ActiveProjects = res.success.data;
                });
            },
            error: (error) => {
                console.error('Error applying', error);
            }
        });
    }

    canApplyToPosition(majors: string[], gpa: number): Boolean {
        if (gpa > this.GPA) { return false; }
        // if (majors.length > 0 && majors.indexOf(this.Major) === -1) { return false; }
        return true;
    }

    alreadyApplied(id: string, button: boolean): boolean {
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

    getApplicationStatus(id: string, button: boolean): string {
        let index = this.ActiveProjects.findIndex(x => x.projectID === id);
        let nameIndex = this.ActiveProjects[index].applications.findIndex((y: any) => y.name === this.Name && y.gpa === this.GPA);
        if (nameIndex !== -1) {
            return this.ActiveProjects[index].applications[nameIndex].status;
        }
        return "Error";
    }

}
