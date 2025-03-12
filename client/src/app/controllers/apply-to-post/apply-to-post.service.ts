import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApplyRequestData } from 'app/students/models/applyRequestData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplyToPostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProjectInfo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/getProjectInfo`, data);
  }

  createApplication(data: ApplyRequestData): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/createApplication`, data);
  }
}
