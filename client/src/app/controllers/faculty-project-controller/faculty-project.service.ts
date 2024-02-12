import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { TableDataSharingService } from 'src/app/_helpers/table-data-sharing/table-data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyProjectService {
  apiUrl = environment.apiUrl;
  private authToken: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private tableShare: TableDataSharingService) { }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap((response: any) => this.setAuthToken(response?.success?.accessToken))
      );
  }

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

  demoGetActiveProjects(): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/projects/getAllProjects`, { headers });
  }

  demoGetStudentData(): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/applications/demoGetStudentInfo`, { headers });
  }

  demoApplyToPosition(email: String, projectId: String, GPA: Number): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectId, "professorEmail": email, "gpa": GPA };

    return this.http.post(`${this.apiUrl}/applications/createApplication`, data, { headers });
  }

  demoFetchApplicants(projectId: String): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectId };

    return this.http.post(`${this.apiUrl}/projects/getApplicants`, data, { headers: headers });
  }

  //This method access the backend API for fetching a single applicant. It requires the id of the project and the application id
  fetchApplicant(projectID: String, applicantionID: String): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectID, "applicationID": applicantionID }

    return this.http.post(`${this.apiUrl}/projects/getApplicant`, data, { headers: headers });
  }

  demoAutoCreateAccount(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/register`, data, { headers: headers });
  }

  applicationDecision(data: any): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.put(`${this.apiUrl}/projects/application`, data, { headers });
  }

  //This method either rejects or accepts the applicant based on which button the professor selected
  //it takes the decision and application id and then makes a server request to update the application status
  applicationDecide(app: any, projectID: any, decision: String): Observable<any> {
    let decision2 = (decision === 'Accept') ? 'Accept' : 'Reject';
    let data = {
      "projectID": projectID,
      "applicationID": app,
      "decision": decision2
    }
    console.log(app + " " + projectID);
    return this.applicationDecision(data); //Use the other method that creates a server request to update decision.
  }

  //This method gets detailed information from a specific project, i.e. it also grabs the student's questions + answers from the database
  detailedFetchApplicants(projectId: String): Observable<any> {
    const headers = this.authService.getHeaders();
    const data = { "projectID": projectId };

    return this.http.post(`${this.apiUrl}/projects/getDetailedApplicants`, data, { headers: headers });
  }
}
