import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileControllerService {

  constructor(private router: Router,) { }

  //This can be used on buttons or other stuff to route you to the page
  routeToProfileScreen() {
    this.router.navigate(['/profile-details']);
  }
}
