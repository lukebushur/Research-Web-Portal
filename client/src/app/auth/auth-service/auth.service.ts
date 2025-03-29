import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmResetPasswordBody, LoginBody, SignupBody } from '../models/request-bodies';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_KEY = 'jwt-auth-token';
  private apiUrl = environment.apiUrl;

  private authenticated$ = new BehaviorSubject(
    localStorage.getItem(this.JWT_KEY) ? true : false
  );

  constructor(private http: HttpClient) { }

  // Get value of the authenticated subject as an observable
  // (uneditable by the client)
  isAuthenticated(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  // set the value of the authenticated subject
  setAuthenticated(authenticated: boolean) {
    this.authenticated$.next(authenticated);
  }

  // Send request to sign up the user with the given information
  signup(data: SignupBody): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Send request to confirm the given user's email
  confirmEmail(userId: string, emailToken: string): Observable<any> {
    const data = { userId, emailToken };

    return this.http.post(`${this.apiUrl}/confirmEmail`, data);
  }

  // Login using the given data
  login(data: LoginBody): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Send request to initiate the forgot password process
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accountManagement/resetPassword`, { email });
  }

  // Send request to confirm and finish the forgot password process
  confirmResetPassword(data: ConfirmResetPasswordBody): Observable<any> {
    return this.http.post(`${this.apiUrl}/accountManagement/confirmResetPassword`, data);
  }

  // remove the JWT token
  signout() {
    localStorage.removeItem('jwt-auth-token');
    this.setAuthenticated(false);
  }
}
