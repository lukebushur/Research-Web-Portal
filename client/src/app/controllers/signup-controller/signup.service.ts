import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-controller/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private registerUrl = `${environment.apiUrl}/register`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  signup(data: any): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.post(this.registerUrl, data, { headers: headers });
  }
}
