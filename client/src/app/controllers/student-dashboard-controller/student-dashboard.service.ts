import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth-service/auth.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Send request to the back-end for the applications associated with the user
  getStudentApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/getApplications`);
  }

  // Send request to the back-end for all the opportunities available to students
  getOpportunities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/getAllProjects`)
  }

  // Send request to the back-end for the majors list associated with the given
  // university or the user's university
  getAvailableMajors(university?: string): Observable<any> {
    return this.authService.getMajors(university);
  }

  // Send request to the back-end for the student user's information
  getStudentInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/accountManagement/getAccountInfo`)
  }

  //Send a request to grab a singular application from the student perspective
  getApplication(applicationID: string): Observable<any> {

    // Data to send to the back-end
    const data = {
      "applicationID": applicationID
    }

    // Send the request to the back-end
    return this.http.post(`${this.apiUrl}/applications/getApplication`, data)
  }

  // Get the project information for the given professor and project ID
  getProjectInfo(professorEmail: string, projectID: string): Observable<any> {

    // Generate the data to send to the back-end
    const data = {
      "professorEmail": professorEmail,
      "projectID": projectID
    }

    // Send the request to the back-end
    return this.http.post(`${this.apiUrl}/applications/getProjectInfo`, data)
  }

  // To update an application pass the application ID and the questions to update
  updateApplication(applicationID: string, questions: any): Observable<any> {
    // Data to send to the back-end
    const data = {
      "questions": questions,
      "applicationID": applicationID
    }

    // Send the request to the back-end
    return this.http.put(`${this.apiUrl}/applications/updateApplication`, data)
  }

  // To delete an application pass the application ID
  deleteApplication(applicationID: string): Observable<any> {
    // Options to send to the back-end
    const options = {
      body: {
        "applicationID": applicationID,
      }
    }

    // Send the request to the back-end
    // The delete method is used to send the application ID in the body of the request
    return this.http.delete(`${this.apiUrl}/applications/deleteApplication`, options);
  }
}
