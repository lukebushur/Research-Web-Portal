import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmailService } from 'src/controllers/email-controller/email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class ConfirmEmailComponent {
  public href: string = "";
  public token: string = "";

  url: string = environment.ipUrl;

  constructor(private emailService: EmailService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.emailService.confirmEmail();
  }
}
