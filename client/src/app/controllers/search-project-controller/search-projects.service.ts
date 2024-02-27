import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-controller/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchProjectsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }
  //This method is pretty simple, just fill in the fields that exist or will be used with the search or null if not. To the best of my knowledge, js/ts does 
  //not support named parameters so if you wanted to only serach with deadline, the correct call to this method would be searchProjectsMultipleParams(null, null, null, null, null, null, DATE PARAMETER)
  searchProjectsMultipleParams(query: string | null, majors: string[] | null, GPA: number | null, npp: number | null,
    pageNum: number | null, posted: Date | null, deadline: Date | null): Observable<any> {
    const headers = this.authService.getHeaders();
    let request = "?";
    let useAndSym = false;

    if (query) {
      request += "query=" + query;
      useAndSym = true;
    }
    if (majors) {
      let val: string = "";
      majors.forEach(element => {
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
    if (GPA) {
      if (useAndSym) {
        request += "&GPA=" + GPA;
      } else {
        request += "GPA=" + GPA;
        useAndSym = true;
      }
    }
    if (npp) {
      if (useAndSym) {
        request += "&npp=" + npp;
      } else {
        request += "npp=" + npp;
        useAndSym = true;
      }
    }
    if (pageNum) {
      if (useAndSym) {
        request += "&pageNum=" + pageNum;
      } else {
        request += "pageNum=" + pageNum;
        useAndSym = true;
      }
    }
    if (posted) {
      if (useAndSym) {
        request += "&posted=" + posted.toISOString();
      } else {
        request += "posted=" + posted.toISOString();
        useAndSym = true;
      }
    }
    if (deadline) {
      if (useAndSym) {
        request += "&deadline=" + deadline.toISOString();
      } else {
        request += "deadline=" + deadline.toISOString();
        useAndSym = true;
      }
    }
    console.log(request);
    return this.http.get(`${this.apiUrl}/search/searchProjects` + request, { headers });
  }
  //This does the same as above, but takes the query params as a string in the parameters instead of individual parameters
  searchProjectsSingleParams(queryParams: string): Observable<any> {
    const headers = this.authService.getHeaders();

    return this.http.get(`${this.apiUrl}/search/searchProjects` + queryParams, { headers });
  }
}
