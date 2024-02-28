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

  // Login using the given data
  login(data: any): Observable<any> {
    console.log(this.apiUrl + data);
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Send request to the back-end to initiate the forgot password process
  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accountManagement/resetPassword`, data);
  }

  // Send request to the back-end to confirm and finish the forgot password process
  confirmResetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accountManagement/confirmResetPassword`, data);
  }
}
