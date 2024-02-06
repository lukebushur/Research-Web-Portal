import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient,) { }

  apiUrl = environment.apiUrl;
  
  getHeaders() {
    const authToken = localStorage.getItem("jwt-auth-token");
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  }

  //Helper method to grab the auth token from local storage
  getAuthToken(): String | null {
    return localStorage.getItem("jwt-auth-token");
  }

  //This function grabs all available majors from the data. It is in the auth controlelr because it is a shared route between all accounts
  //and as such does not belong with solely faculty or students 
  getMajors(): Observable<any> {
    const headers = this.getHeaders();

    return this.http.get(`${this.apiUrl}/getMajors`, { headers });
  }
}
