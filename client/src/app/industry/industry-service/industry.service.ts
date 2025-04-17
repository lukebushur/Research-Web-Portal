import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SKIP_LOADING } from 'app/core/loading-interceptor/loading.interceptor';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/industry/createJob`, data);
  }

  getJobs(skipLoad: boolean = false): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getJobs`, {
      context: new HttpContext().set(SKIP_LOADING, skipLoad),
    });
  }

  getJob(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getJob/${jobId}`);
  }

  editJob(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/industry/editJob`, data);
  }

  deleteJob(jobId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/industry/deleteJob/${jobId}`);
  }

  createAssessment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/industry/createAssessment`, data);
  }

  getAssessments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getAssessments`);
  }

  getAssessment(assessmentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getAssessment/${assessmentId}`);
  }

  editAssessment(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/industry/editAssessment`, data);
  }

  deleteAssessment(assessmentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/industry/deleteAssessment/${assessmentId}`);
  }
}
