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

  getName() {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/industry/getName`, { headers });
  }
}