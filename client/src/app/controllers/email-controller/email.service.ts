import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  confirmEmail(emailToken: string): Observable<any> {
    const authToken = this.authService.getHeaders();

    const data = { emailToken };

    return this.http.post(`${this.apiUrl}/confirmEmail`, data, { headers: authToken });
  }
}
