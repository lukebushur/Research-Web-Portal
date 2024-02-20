import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { ApplyRequestData } from 'src/app/_models/apply-to-post/applyRequestData';

@Injectable({
  providedIn: 'root'
})
export class ApplyToPostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjects() {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/projects/getAllProjects`, { headers });
  }

  createApplication(data: ApplyRequestData) {
    const headers = this.authService.getHeaders();

    return this.http.post(`${this.apiUrl}/applications/createApplication`, data, { headers });
  }
}
