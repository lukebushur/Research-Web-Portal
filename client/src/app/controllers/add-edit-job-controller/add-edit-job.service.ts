import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddEditJobService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getJob(jobId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/industry/getJob/${jobId}`, { headers });
  }

  createJob(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.apiUrl}/industry/createJob`, data, { headers: headers });
  }

  editJob(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/industry/editJob`, data, { headers: headers });
  }
}
