import { Component } from '@angular/core';
import { EmailService } from 'src/controllers/email-controller/email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class ConfirmEmailComponent {
  public href: string = "";
  public token: string = "";

  constructor(private emailService: EmailService) { }

  ngOnInit() {
    this.emailService.confirmEmail();
  }
}
