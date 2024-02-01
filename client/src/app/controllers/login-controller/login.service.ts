import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    console.log(this.apiUrl + data);
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}
