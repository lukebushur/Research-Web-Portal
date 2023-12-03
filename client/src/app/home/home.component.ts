import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { JwtPayload } from '../jwt-payload';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public name: string = '';

  constructor() {
    const authToken = localStorage.getItem("jwt-auth-token");

    if (authToken) {
      const decodedToken = jwt_decode(authToken) as JwtPayload;
      this.name = decodedToken.name;
    }
  }
}
