import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Gets account information about the user.
  getAccountInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/accountManagement/getAccountInfo`);
  }

  // This function grabs all available majors from the data. It is in the auth controller
  // because it is a shared route between all accounts and as such does not belong with
  // solely faculty or students. Unless provided with a unversity (from which majors will
  // be grabbed), it will call getAccountInfo() first to get the universityLocation
  // associated with the user. Then, it will get the majors list from the back-end using
  // the given/retrieved information
  async getMajors(university?: string): Promise<Observable<any>> {
    let universityLocation = university;
    if (!universityLocation || universityLocation === '') {
      const accountInfo$ = this.getAccountInfo();
      const result = await firstValueFrom(accountInfo$);
      universityLocation = result.success.accountData.universityLocation;
    }

    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/getMajors?university=${universityLocation}`, { headers });
  }
}
