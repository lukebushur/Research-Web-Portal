import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignoutService {

  constructor() { }

  // remove the JWT token
  signout() {
    localStorage.removeItem('jwt-auth-token');
  }
}
