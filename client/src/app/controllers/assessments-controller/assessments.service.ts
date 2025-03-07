import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAssessments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getAssessments`);
  }

  getAssessment(assessmentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getAssessment/${assessmentId}`);
  }

  createAssessment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/industry/createAssessment`, data);
  }

  editAssessment(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/industry/editAssessment`, data);
  }

  deleteAssessment(assessmentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/industry/deleteAssessment/${assessmentId}`);
  }
}
