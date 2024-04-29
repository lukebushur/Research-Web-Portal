import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { JobProject } from 'src/app/_models/industry/job-projects/jobProject';

@Injectable({
  providedIn: 'root'
})
export class JobProjectService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getJobProjects(): Observable<JobProject[]> {
    const headers = this.authService.getHeaders();
    return this.http.get(
      `${this.apiUrl}/industry/getJobProjects`,
      { headers }
    ).pipe(
      map((data: any) => {
        const jobProjectsData: any[] = data.success.jobProjects;
        return jobProjectsData.map((jobProject: any) => {
          return <JobProject>{
            ...jobProject,
            deadline: new Date(jobProject.deadline),
            dateCreated: new Date(jobProject.dateCreated),
          };
        });
      }),
    );
  }

  getJobProject(jobProjectId: string): Observable<JobProject> {
    const headers = this.authService.getHeaders();
    return this.http.get(
      `${this.apiUrl}/industry/getJobProject/${jobProjectId}`,
      { headers }
    ).pipe(
      map((data: any) => {
        const jobProjectData = JSON.parse(data.success.jobProject);
        return <JobProject>{
          ...jobProjectData,
          deadline: new Date(jobProjectData.deadline),
          dateCreated: new Date(jobProjectData.dateCreated),
        };
      }),
    );
  }

  createJobProject(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.apiUrl}/industry/createJobProject`, data, { headers: headers });
  }

  editJobProject(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/industry/editJobProject`, data, { headers: headers });
  }

  deleteJobProject(jobProjectId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete(`${this.apiUrl}/industry/deleteJobProject/${jobProjectId}`, { headers },);
  }
}
