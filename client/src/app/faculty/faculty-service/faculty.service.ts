import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { ApplicantData, ApplicantProjectData } from '../models/view-applicant';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Send HTTP post request to the server to create the project with the given
  // information.
  // Returns an observable containing the result of the HTTP request.
  createPost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/createProject`, data);
  }

  // get all faculty projects from the server
  getProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/getProjects`);
  }
  // This method accesses the getProject api route, which grabs a singular
  // project from the DB, it takes a projectid and the project type
  getProject(projectId: string, projectType: string): Observable<any> {
    const data = {
      "projectID": projectId,
      "projectType": projectType
    }

    return this.http.post(`${this.apiUrl}/projects/getProject`, data);
  }

  // delete the project with the given project ID and project type
  deleteProject(projectId: string, projectType: string): Observable<any> {
    const options = {
      body: {
        "projectID": projectId,
        "projectType": projectType
      }
    }

    return this.http.delete(`${this.apiUrl}/projects/deleteProject`, options);
  }

  // This method takes the projectID from the webpage and then makes a
  // request to unarchive an archived project
  unarchiveProject(projectID: string): Observable<any> {
    const data = { "projectID": projectID }

    return this.http.put(`${this.apiUrl}/projects/unarchiveProject`, data);
  }

  // Make a request to change a project's type to archived
  archiveProject(projectId: string): Observable<any> {
    const data = { "projectID": projectId }

    return this.http.put(`${this.apiUrl}/projects/archiveProject`, data);
  }
  // Method to access the updateProject API route. It takes the data necessary
  // for the route which should be: projectID, projectType,
  // projectDetails{project{projectName, GPA, majors, categories, description, questions{}, deadline}}
  updateProject(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/updateProject`, data);
  }

  // Make a request to convert a draft project into an active project that
  // is visible to students
  publishDraft(projectId: string): Observable<any> {
    const data = { projectID: projectId };

    return this.http.put(`${this.apiUrl}/projects/publishDraft`, data);
  }

  // This method access the backend API for fetching a single applicant. It
  // requires the ID of the project and the application ID
  fetchApplicant(projectID: String, applicantionID: String) {
    const data = { "projectID": projectID, "applicationID": applicantionID }

    return this.http.post(`${this.apiUrl}/projects/getApplicant`, data).pipe(
      map((value: any) => {
        if (!value.success) {
          throw value.error;
        }

        const data = value.success.responseData;
        const applicantData: ApplicantData = {
          ...data.applicantData,
          appliedDate: new Date(data.applicantData.appliedDate),
        };
        const projectData: ApplicantProjectData = {
          ...data.projectData,
          posted: new Date(data.projectData.posted),
          deadline: new Date(data.projectData.deadline),
        };

        return {
          applicantData,
          projectData
        };
      }),
      catchError((err: any) => {
        throw err;
      })
    );
  }

  // Makes a request to accept/reject a student application for a project
  applicationDecision(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/application`, data);
  }

  // This method either rejects or accepts the applicant based on which button
  // the professor selected. It takes the decision and application id and then
  // makes a server request to update the application status
  applicationDecide(app: string, projectID: string, decision: string): Observable<any> {
    let decision2 = (decision === 'Accept') ? 'Accept' : 'Reject';
    let data = {
      "projectID": projectID,
      "applicationID": app,
      "decision": decision2
    }
    // Use the other method that creates a server request to update decision.
    return this.applicationDecision(data);
  }

  // This method gets detailed applicant information for a specific project.
  // It also grabs the student's questions and answers from the database.
  detailedFetchApplicants(projectId: String): Observable<any> {
    const data = { "projectID": projectId };

    return this.http.post(`${this.apiUrl}/projects/getDetailedApplicants`, data);
  }
}
