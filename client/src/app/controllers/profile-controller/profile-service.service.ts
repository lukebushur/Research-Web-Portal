import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Make a post request to the server to change the user's profile using the
  // given data
  submitProfileChanges(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.apiUrl}/accountManagement/updateAccount`, data, { headers: headers });
  }
}
