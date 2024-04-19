import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignoutService {

  constructor() { }

  // set the jwt-auth-token to a garbage string, as this is the way that the
  // application identifies the user who is logged in
  signout() {
    localStorage.setItem("jwt-auth-token", "garbage");
  }
}
