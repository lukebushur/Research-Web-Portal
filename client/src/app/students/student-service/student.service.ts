import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { SearchOptions } from 'app/students/models/searchOptions';
import { ApplyRequestData } from '../models/applyRequestData';
import { StudentProjectInfo, SuccessStudentProjectInfo } from '../models/student-project-info';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  // Send request to the back-end for all the opportunities available to students
  getOpportunities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/getAllProjects`);
  }

  // This method is pretty simple, just fill in the fields of searchOptions that
  // you want to use when filtering.
  // majors -> comma-separated single string
  // posted and deadline -> toISOString()
  searchProjectsMultipleParams(searchOptions: SearchOptions): Observable<any> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(searchOptions)) {
      if (value) {
        if (key !== 'majors') {
          if (value instanceof Date) {
            params = params.append(key, value.toISOString());
          } else {
            params = params.append(key, value);
          }
        } else {
          if (value.length > 0) {
            params = params.append(key, value.join(','));
          }
        }
      }
    }

    return this.http.get(`${this.apiUrl}/search/searchProjects`, { params });
  }

  // Get the project information for the given professor and project ID
  getProjectInfo(professorEmail: string, projectID: string): Observable<StudentProjectInfo> {

    // Generate the data to send to the back-end
    const data = {
      "professorEmail": professorEmail,
      "projectID": projectID
    }

    // Send the request to the back-end
    return this.http.post<SuccessStudentProjectInfo>(`${this.apiUrl}/applications/getProjectInfo`, data).pipe(
      map((value: SuccessStudentProjectInfo) => {
        const project = value.success.project;

        return <StudentProjectInfo>{
          ...project,
          posted: new Date(project.posted),
          deadline: new Date(project.deadline),
        };
      })
    );
  }

  // Send request to the back end to create an application
  createApplication(data: ApplyRequestData): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/createApplication`, data);
  }

  // Send request to the back-end for the applications associated with the user
  getStudentApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/getApplications`);
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
