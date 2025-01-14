import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { ApplyRequestData } from 'app/_models/apply-to-post/applyRequestData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplyToPostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjectInfo(data: any) : Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.apiUrl}/applications/getProjectInfo`, data, { headers });
  }

  createApplication(data: ApplyRequestData) : Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.apiUrl}/applications/createApplication`, data, { headers });
  }
}
