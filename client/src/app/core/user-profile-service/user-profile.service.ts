import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Gets account information about the user.
  getAccountInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/accountManagement/getAccountInfo`);
  }

  // This function grabs all available majors from either the given university
  // or from the university the user is associated with (from getAccountInfo).
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

  // Make a post request to the server to change the user's profile
  submitProfileChanges(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accountManagement/updateAccount`, data);
  }
}
