import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class ConfirmEmailComponent {
  public href: string = "";
  public token: string = "";

  url: string = environment.ipUrl;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    let token = this.href.split("/").pop();
    if (token) {
      this.token = token;
    }
    const authToken = localStorage.getItem("jwt-auth-token");
    if (this.token && authToken) {

      const data = {
        ["emailToken"]: this.token,
      };

      const headers = {
        ["authorization"]: `Bearer ${authToken}`
      }
      console.log(this.token);
      console.log(data);
      this.http.post(`${this.url}/api/confirmEmail`, data, {headers: headers})
        .subscribe((response: any) => {
          console.log('Email confirmation successful!', response);
          this.router.navigate(['/home']);
        }, (error: any) => {
          console.error('Confirmation failed.', error);
        });
    }
  }
}
