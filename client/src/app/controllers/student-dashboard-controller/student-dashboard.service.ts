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
  // uses our auth service in order to insert our http headers
  getStudentApplications(): Observable<any> {
    const headers = this.authService.getHeaders()
    return this.http.get(`${this.apiUrl}/applications/getApplications`, { headers });
  }

  // Send request to the back-end for all the opportunities available to students
  // uses our auth service in order to insert our http headers
  getOpportunities(): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/projects/getAllProjects`, { headers })
  }

  // Send request to the back-end for the majors list associated with the given
  // university or the user's university
  // uses the authservice in order to get the available majors from a university
  async getAvailableMajors(university?: string): Promise<Observable<any>> {
    return await this.authService.getMajors(university);
  }

  // Send request to the back-end for the student user's information
  // uses our auth service in order to insert our http headers
  // uses the /accountManagement/getAccountInfo route
  getStudentInfo(): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/accountManagement/getAccountInfo`, { headers })
  }

  //Send a request to grab a singular application from the student perspective
  // uses our auth service in order to insert our http headers
  // uses the /applications/getApplication route
  getApplication(applicationID: string): Observable<any> {
    const headers = this.authService.getHeaders();

    // Data to send to the back-end
    const data = {
      "applicationID": applicationID
    }

    // Send the request to the back-end
    return this.http.post(`${this.apiUrl}/applications/getApplication`, data, { headers })
  }

  // Get the project information for the given professor and project ID
  // uses our auth service in order to insert our http headers
  //uses the /applications/getProjectInfo route
  getProjectInfo(professorEmail: string, projectID: string): Observable<any> {
    const headers = this.authService.getHeaders();

    // Generate the data to send to the back-end
    const data = {
      "professorEmail": professorEmail,
      "projectID": projectID
    }

    // Send the request to the back-end
    return this.http.post(`${this.apiUrl}/applications/getProjectInfo`, data, { headers })
  }

  // To update an application pass the application ID and the questions to update
  // uses our auth service in order to insert our http headers
  // uses the /applications/updateApplication route
  updateApplication(applicationID: string, questions: any): Observable<any> {
    const headers = this.authService.getHeaders();

    // Data to send to the back-end
    const data = {
      "questions": questions,
      "applicationID": applicationID
    }

    // Send the request to the back-end
    return this.http.put(`${this.apiUrl}/applications/updateApplication`, data, { headers })
  }

  // To delete an application pass the application ID
  // uses our auth service in order to insert our http headers
  deleteApplication(applicationID: string): Observable<any> {
    const headers = this.authService.getHeaders();

    // Options to send to the back-end
    const options = {
      headers: headers,
      body: {
        "applicationID": applicationID,
      }
    }

    // Send the request to the back-end
    // The delete method is used to send the application ID in the body of the request
    return this.http.delete(`${this.apiUrl}/applications/deleteApplication`, options);
  }
}
