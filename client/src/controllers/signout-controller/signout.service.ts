import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignoutService {

  constructor() { }

  signout() {
    localStorage.setItem("jwt-auth-token", "garbage");
    localStorage.setItem("account-type", "");
  }
}
