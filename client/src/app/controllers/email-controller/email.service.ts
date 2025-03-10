import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  confirmEmail(userId: string, emailToken: string): Observable<any> {
    const data = { userId, emailToken };

    return this.http.post(`${this.apiUrl}/confirmEmail`, data);
  }
}
