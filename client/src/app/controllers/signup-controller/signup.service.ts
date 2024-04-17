import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-controller/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  //getting our api url from our environment variables
  private apiUrl = environment.apiUrl;

  //bringing in our imported httpclient and our authservice for use
  constructor(private http: HttpClient, private authService: AuthService) { }

  //function that is used to register a user, this uses the /register route and uses our getheaders method to insert our http headers
  //from our authservice file into our http post call.
  signup(data: any): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.post(`${this.apiUrl}/register`, data, { headers: headers });
  }
}
