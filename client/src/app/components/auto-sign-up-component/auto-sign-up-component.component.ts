import { Component, OnInit } from '@angular/core';
import { FacultyProjectService } from '../../../controllers/faculty-project-controller/faculty-project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auto-sign-up-component',
  templateUrl: './auto-sign-up-component.component.html',
  styleUrls: ['./auto-sign-up-component.component.css']
})
export class AutoSignUpComponent {

  constructor(private facultyService: FacultyProjectService, private router: Router) {
    let lastNames = [
      "Smith", "Johnson", "Williams", "Jones", "Brown",
      "Davis", "Miller", "Wilson", "Moore", "Taylor",
      "Anderson", "Thomas", "Jackson", "White", "Harris",
      "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
      "Clark", "Rodriguez", "Lewis", "Lee", "Walker",
      "Hall", "Allen", "Young", "Hernandez", "King",
      "Wright", "Lopez", "Hill", "Scott", "Green",
      "Adams", "Baker", "Nelson", "Mitchell", "Carter"
    ];
    let firstNames = [
      "Emma", "Liam", "Olivia", "Noah", "Ava",
      "Isabella", "Sophia", "Jackson", "Lucas", "Aiden",
      "Mia", "Leah", "Oliver", "Amelia", "Evelyn",
      "Benjamin", "Henry", "Sebastian", "Elijah", "Matthew",
      "Aria", "Grace", "Carter", "Samuel", "Joseph",
      "David", "Dylan", "Natalie", "Chloe", "Ella",
      "Scarlett", "Lily", "Grace", "Hudson", "Leo",
      "Lincoln", "Wyatt", "Zoe", "Abigail", "Emily"
    ];
    let firstIndex = Math.floor(Math.random() * firstNames.length);
    let lastIndex = Math.floor(Math.random() * lastNames.length);
    this.randomName = firstNames[firstIndex] + " " + lastNames[lastIndex];
    this.randomEmail = this.generateRandomEmail(14);
  }

  randomName: string;
  randomEmail: string;

  ngOnInit(): void {
    let data = {
      "email": this.randomEmail,
      "name": this.randomName,
      "password": this.randomEmail,
      "accountType": 0
    }

    this.facultyService.demoAutoCreateAccount(data).subscribe({
      next: (res) => {
        const authToken = res?.success?.accessToken;
        if (authToken) {
          // Store the authentication token in local storage
          localStorage.setItem("jwt-auth-token", authToken);
          this.router.navigate(["/demoProjects"]);
        }
      },
    });

  }

  generateRandomEmail(prefixLength: number) {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    const allCharacters = uppercaseLetters + lowercaseLetters + numbers;

    const randomChar = () => allCharacters[Math.floor(Math.random() * allCharacters.length)];

    let emailPrefix = '';
    for (let i = 0; i < prefixLength; i++) {
      emailPrefix += randomChar();
    }

    const randomEmail = `${emailPrefix}@example.com`;

    return randomEmail;
  }









}
