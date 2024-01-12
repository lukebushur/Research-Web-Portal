import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacultyProjectService {
  apiUrl = environment.apiUrl;
  private authToken: string | null = null;

  constructor(private http: HttpClient) { }

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
    const authToken = localStorage.getItem("jwt-auth-token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.get(`${this.apiUrl}/projects/getProjects`, { headers });
  }

  deleteProject(projectId: string, projectType: string): Observable<any> {
    const authToken = localStorage.getItem("jwt-auth-token");

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }),
      body: {
        "projectID": projectId,
        "projectType": projectType
      }
    }

    return this.http.delete(`${this.apiUrl}/projects/deleteProject`, options);
  }

  archiveProject(projectId: string): Observable<any> {
    const authToken = localStorage.getItem("jwt-auth-token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
    const data = { "projectID": projectId }

    return this.http.put(`${this.apiUrl}/projects/archiveProject`, data, { headers });
  }

  demoGetActiveProjects(): Observable<any> {
    const authToken = localStorage.getItem("jwt-auth-token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.get(`${this.apiUrl}/projects/getAllProjects`, { headers });
  }

  demoGetStudentData(): Observable<any> {
    const authToken = localStorage.getItem("jwt-auth-token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.get(`${this.apiUrl}/applications/demoGetStudentInfo`, { headers });
  }

  demoApplyToPosition(email: String, projectId: String, GPA: Number): Observable<any> {
    const authToken = localStorage.getItem("jwt-auth-token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
    const data = { "projectID": projectId, "professorEmail": email, "gpa": GPA };

    return this.http.post(`${this.apiUrl}/applications/createApplication`, data, { headers });
  }

  demoFetchApplicants(projectId: String): Observable<any> {
    const authToken = localStorage.getItem("jwt-auth-token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
    const data = { "projectID": projectId };

    return this.http.post(`${this.apiUrl}/projects/getApplicants`, data, { headers: headers });
  }

  demoAutoCreateAccount(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/register`, data, { headers: headers });
  }

  applicationDecision(data: any): Observable<any> {
    const authToken = localStorage.getItem("jwt-auth-token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.put(`${this.apiUrl}/projects/application`, data, { headers });
  }
}
