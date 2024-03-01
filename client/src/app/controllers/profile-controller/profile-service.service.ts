import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = environment.apiUrl;

  submitProfileChanges(): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.post(`${this.apiUrl}/accountManagement/updateAccount`, { headers: headers});
  }
}
