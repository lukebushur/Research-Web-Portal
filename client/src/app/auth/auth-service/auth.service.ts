import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, map, mergeMap } from 'rxjs';
import { ConfirmResetPasswordBody, LoginBody } from '../models/request-bodies';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  // TODO: Move to user-profile-service
  // Gets account information about the user.
  getAccountInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/accountManagement/getAccountInfo`);
  }


  // Login using the given data
  login(data: LoginBody): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Send request to the back-end to initiate the forgot password process
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accountManagement/resetPassword`, { email });
  }

  // Send request to the back-end to confirm and finish the forgot password process
  confirmResetPassword(data: ConfirmResetPasswordBody): Observable<any> {
    return this.http.post(`${this.apiUrl}/accountManagement/confirmResetPassword`, data);
  }

  // Send request to confirm the given user's email
  confirmEmail(userId: string, emailToken: string): Observable<any> {
    const data = { userId, emailToken };

    return this.http.post(`${this.apiUrl}/confirmEmail`, data);
  }

  // remove the JWT token
  signout() {
    localStorage.removeItem('jwt-auth-token');
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
