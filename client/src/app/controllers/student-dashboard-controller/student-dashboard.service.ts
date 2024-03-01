import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Send request to the back-end for the applications associated with the user
  getStudentApplications(): Observable<any> {
    const headers = this.authService.getHeaders()
    return this.http.get(`${this.apiUrl}/applications/getApplications`, { headers });
  }

  // Send request to the back-end for all the opportunities available to students
  getOpportunities(): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/projects/getAllProjects`, { headers })
  }

  // Send request to the back-end for the majors list associated with the given
  // university or the user's university
  async getAvailableMajors(university?: string): Promise<Observable<any>> {
    return await this.authService.getMajors(university);
  }

  // Send request to the back-end for the student user's information
  getStudentInfo(): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/accountManagement/getAccountInfo`, { headers })
  }

  //Send a request to grab a singular application from the student perspective
  getApplication(applicationID: string): Observable<any> {
    const headers = this.authService.getHeaders();

    const data = {
      "applicationID": applicationID
    }

    return this.http.post(`${this.apiUrl}/applications/getApplication`, data, { headers })
  }

  getProjectInfo(professorEmail: string, projectID: string): Observable<any> {
    const headers = this.authService.getHeaders();

    const data = {
      "professorEmail": professorEmail,
      "projectID": projectID
    }

    return this.http.post(`${this.apiUrl}/applications/getProjectInfo`, data, { headers })
  }

  updateApplication(applicationID: string, questions: any): Observable<any> {
    const headers = this.authService.getHeaders();

    const data = {
      "questions": questions,
      "applicationID": applicationID
    }

    return this.http.put(`${this.apiUrl}/applications/updateApplication`, data, { headers })
  }

  deleteApplication(applicationID: string): Observable<any> {
    const headers = this.authService.getHeaders();

    const options = {
      headers: headers,
      body: {
        "applicationID": applicationID,
      }
    }

    return this.http.delete(`${this.apiUrl}/applications/deleteApplication`, options);
  }
}
