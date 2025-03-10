import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostCreationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Send HTTP post request to the server to create the project with the given
  // information.
  // Returns an observable containing the result of the HTTP request.
  createPost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/createProject`, data);
  }
}
