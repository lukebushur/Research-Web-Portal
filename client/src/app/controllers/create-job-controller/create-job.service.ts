import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateJobService {
  private createJobUrl = `${environment.apiUrl}/industry/createJob`

  constructor(private http: HttpClient, private authService: AuthService) { }

  createJob(data: any): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.post(this.createJobUrl, data, { headers: headers });
  }
}
