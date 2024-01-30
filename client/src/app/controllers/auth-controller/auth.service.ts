import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getHeaders() {
      const authToken = localStorage.getItem("jwt-auth-token");
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      });
  }

  //Helper method to grab the auth token from local storage
  getAuthToken():  String | null  {
    return localStorage.getItem("jwt-auth-token");
  }
}