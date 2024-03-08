import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAssessments(): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/industry/getAssessments`, { headers });
  }

  getAssessment(assessmentId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/industry/getAssessment/${assessmentId}`, { headers });
  }

  createAssessment(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.apiUrl}/industry/createAssessment`, data, { headers });
  }

  editAssessment(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/industry/editAssessment`, data, { headers });
  }

  deleteAssessment(assessmentId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete(`${this.apiUrl}/industry/deleteAssessment/${assessmentId}`, { headers });
  }
}
