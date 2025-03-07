import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddEditJobService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getJob(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/industry/getJob/${jobId}`);
  }

  createJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/industry/createJob`, data);
  }

  editJob(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/industry/editJob`, data);
  }
}
