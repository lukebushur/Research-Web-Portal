import { Component } from '@angular/core';
import { EmailService } from 'src/app/controllers/email-controller/email.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent {
  public href: string = "";
  public token: string = "";

  constructor(private emailService: EmailService) { }

  ngOnInit() {
    this.emailService.confirmEmail();
  }
}
