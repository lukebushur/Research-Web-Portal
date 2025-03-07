import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndustryDashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getJobs`);
  }

  deleteJob(jobId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/industry/deleteJob/${jobId}`);
  }
}
