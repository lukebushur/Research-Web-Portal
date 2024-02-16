import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IndustryDashboardService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getJobs() {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/industry/getJobs`, { headers });
  }

  deleteJob(jobId: string) {
    const headers = this.authService.getHeaders();
    console.log(jobId);
    

    return this.http.delete(`${this.apiUrl}/industry/deleteJob/${jobId}`, { headers },);
  }
}