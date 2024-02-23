import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, firstValueFrom } from 'rxjs';

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

  // Gets account information about the user.
  getAccountInfo(): Observable<any> {
    const headers = this.getHeaders();

    return this.http.get(`${this.apiUrl}/accountManagement/getAccountInfo`, { headers });
  }

  //This function grabs all available majors from the data. It is in the auth controller because it is a shared route between all accounts
  //and as such does not belong with solely faculty or students. Unless provided with a unversity (from which majors will be grabbed), it will
  //call getAccountInfo() first to get the universityLocation associated with the user.
  async getMajors(university?: string): Promise<Observable<any>> {
    let universityLocation = university;
    if (!universityLocation || universityLocation === '') {
      const accountInfo$ = this.getAccountInfo();
      const result = await firstValueFrom(accountInfo$);
      console.log(result);
      universityLocation = result.success.accountData.universityLocation;
    }

    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/getMajors?university=${universityLocation}`, { headers });
  }
}
