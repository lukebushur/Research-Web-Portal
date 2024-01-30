import { Component } from '@angular/core';
import { SignoutService } from 'src/app/controllers/signout-controller/signout.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent {
  constructor(private signoutService: SignoutService) {
    signoutService.signout();
  }
}
