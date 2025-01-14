import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndustryDashboardService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getJobs(): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/industry/getJobs`, { headers });
  }

  deleteJob(jobId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete(`${this.apiUrl}/industry/deleteJob/${jobId}`, { headers },);
  }
}
