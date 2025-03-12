import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { SearchOptions } from 'app/students/models/searchOptions';

@Injectable({
  providedIn: 'root'
})

export class SearchProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // This method is pretty simple, just fill in the fields of searchOptions that
  // you want to use when filtering.
  // majors -> comma-separated single string
  // posted and deadline -> toISOString()
  searchProjectsMultipleParams(searchOptions: SearchOptions): Observable<any> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(searchOptions)) {
      if (value) {
        if (key !== 'majors') {
          if (value instanceof Date) {
            params = params.append(key, value.toISOString());
          } else {
            params = params.append(key, value);
          }
        } else {
          if (value.length > 0) {
            params = params.append(key, value.join(','));
          }
        }
      }
    }

    return this.http.get(`${this.apiUrl}/search/searchProjects`, { params });
  }
}
