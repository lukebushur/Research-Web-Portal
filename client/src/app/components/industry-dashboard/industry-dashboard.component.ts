import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndustryDashboardService } from 'src/app/controllers/industry-dashboard-controller/industry-dashboard.service';

@Component({
  selector: 'app-industry-dashboard',
  templateUrl: './industry-dashboard.component.html',
  styleUrls: ['./industry-dashboard.component.css']
})
export class IndustryDashboardComponent {
  userName: string = "";

  constructor(private router: Router, private industryDashboardService: IndustryDashboardService) { }

  ngOnInit() {
    this.industryDashboardService.getName().subscribe({
      next: (data: any) => {
        this.userName = data.success.name;
      }
    });
  }

  createJob() {
    this.router.navigate(['/create-job']);
  }
}
