import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-controller/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostCreationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  createPost(data: any): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.post(`${this.apiUrl}/projects/createProject`, data, {headers: headers});
  }
}
