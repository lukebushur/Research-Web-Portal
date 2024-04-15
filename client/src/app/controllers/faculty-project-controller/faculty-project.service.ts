import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyProjectService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjects(): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/projects/getProjects`, { headers });
  }
  //This method accesses the getProject api route, which grabs a singular project from the DB, it takes a projectid and the project type
  getProject(projectId: string, projectType: string): Observable<any> {
    const headers = this.authService.getHeaders();

    const data = {
      "projectID": projectId,
      "projectType": projectType
    }

    return this.http.post(`${this.apiUrl}/projects/getProject`, data, { headers });
  }


  deleteProject(projectId: string, projectType: string): Observable<any> {
    const headers = this.authService.getHeaders();

    const options = {
      headers: headers,
      body: {
        "projectID": projectId,
        "projectType": projectType
      }
    }

    return this.http.delete(`${this.apiUrl}/projects/deleteProject`, options);
  }

  //This method takes the projectID from the webpage and then makes a request to unarchive an archived project
  unarchiveProject(projectID: string): Observable<any> { 
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectID }

    return this.http.put(`${this.apiUrl}/projects/unarchiveProject`, data, { headers });
  }

  archiveProject(projectId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectId }

    return this.http.put(`${this.apiUrl}/projects/archiveProject`, data, { headers });
  }
  //Method to access the updateProject API route, it takes the data necessary for the route which should be:
  //ProjectID, ProjectType, projectDetails{project{projectName, GPA, majors, categories, description, questions{}, deadline}}
  updateProject(data: any): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.put(`${this.apiUrl}/projects/updateProject`, data, { headers });
  }

  publishDraft(projectId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { projectID: projectId };

    return this.http.put(`${this.apiUrl}/projects/publishDraft`, data, { headers });
  }

  //This method access the backend API for fetching a single applicant. It requires the id of the project and the application id
  fetchApplicant(projectID: String, applicantionID: String): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectID, "applicationID": applicantionID }

    return this.http.post(`${this.apiUrl}/projects/getApplicant`, data, { headers: headers });
  }

  applicationDecision(data: any): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.put(`${this.apiUrl}/projects/application`, data, { headers });
  }

  //This method either rejects or accepts the applicant based on which button the professor selected
  //it takes the decision and application id and then makes a server request to update the application status
  applicationDecide(app: string, projectID: string, decision: string): Observable<any> {
    let decision2 = (decision === 'Accept') ? 'Accept' : 'Reject';
    let data = {
      "projectID": projectID,
      "applicationID": app,
      "decision": decision2
    }
    return this.applicationDecision(data); //Use the other method that creates a server request to update decision.
  }

  //This method gets detailed information from a specific project, i.e. it also grabs the student's questions + answers from the database
  detailedFetchApplicants(projectId: String): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectId };

    return this.http.post(`${this.apiUrl}/projects/getDetailedApplicants`, data, { headers: headers });
  }
}
