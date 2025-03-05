import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'environments/environment';
import { SearchOptions } from 'app/_models/searchOptions';

@Injectable({
  providedIn: 'root'
})

export class SearchProjectService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }
  //This method is pretty simple, just fill in the fields that exist or will be used with the search or null if not. To the best of my knowledge, js/ts does
  //not support named parameters so if you wanted to only serach with deadline, the correct call to this method would be searchProjectsMultipleParams(null, null, null, null, null, null, DATE PARAMETER)
  searchProjectsMultipleParams(searchOptions: SearchOptions): Observable<any> {
    const headers = this.authService.getHeaders();
    let request = "?";
    let useAndSym = false;

    if (searchOptions.query) {
      request += "query=" + searchOptions.query;
      useAndSym = true;
    }
    if (searchOptions.majors) {
      let val: string = "";
      searchOptions.majors.forEach(element => {
        val += element + ",";
      });
      val = val.slice(0, -1);

      if (useAndSym) {
        request += "&majors=" + val;
      } else {
        request += "majors=" + val;
        useAndSym = true;
      }
    }
    if (searchOptions.GPA) {
      if (useAndSym) {
        request += "&GPA=" + searchOptions.GPA;
      } else {
        request += "GPA=" + searchOptions.GPA;
        useAndSym = true;
      }
    }
    if (searchOptions.npp) {
      if (useAndSym) {
        request += "&npp=" + searchOptions.npp;
      } else {
        request += "npp=" + searchOptions.npp;
        useAndSym = true;
      }
    }
    if (searchOptions.pageNum) {
      if (useAndSym) {
        request += "&pageNum=" + searchOptions.pageNum;
      } else {
        request += "pageNum=" + searchOptions.pageNum;
        useAndSym = true;
      }
    }
    if (searchOptions.posted) {
      if (useAndSym) {
        request += "&posted=" + searchOptions.posted.toISOString();
      } else {
        request += "posted=" + searchOptions.posted.toISOString();
        useAndSym = true;
      }
    }
    if (searchOptions.deadline) {
      if (useAndSym) {
        request += "&deadline=" + searchOptions.deadline.toISOString();
      } else {
        request += "deadline=" + searchOptions.deadline.toISOString();
        useAndSym = true;
      }
    }

    return this.http.get(`${this.apiUrl}/search/searchProjects` + request, { headers });
  }
  //This does the same as above, but takes the query params as a string in the parameters instead of individual parameters
  searchProjectsSingleParams(queryParams: string): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/search/searchProjects` + queryParams, { headers });
  }
}
