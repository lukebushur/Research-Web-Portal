import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, map, mergeMap } from 'rxjs';

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
  getMajors(university?: string): Observable<any> {
    if (university) {
      return this.http.get(`${this.apiUrl}/getMajors?university=${university}`);
    }

    return this.getAccountInfo().pipe(
      map((result) => result?.success?.accountData?.universityLocation),
      mergeMap(universityLocation =>
        this.http.get(`${this.apiUrl}/getMajors?university=${universityLocation}`))
    );
  }
}
