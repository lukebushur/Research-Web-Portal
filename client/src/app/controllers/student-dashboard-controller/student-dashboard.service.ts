import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  //service that will call to the /getApplications backend route
  getStudentApplications() : Observable<any> {
    const headers = this.authService.getHeaders()
    
    return this.http.get(`${this.apiUrl}/applications/getApplications`, { headers });
  }
}
