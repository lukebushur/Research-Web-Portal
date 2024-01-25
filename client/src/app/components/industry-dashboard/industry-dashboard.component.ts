import { Component } from '@angular/core';
import { IndustryDashboardService } from 'src/controllers/industry-dashboard-controller/industry-dashboard.service';

@Component({
  selector: 'app-industry-dashboard',
  templateUrl: './industry-dashboard.component.html',
  styleUrls: ['./industry-dashboard.component.css']
})
export class IndustryDashboardComponent {
  userName: string = "";

  constructor(private industryDashboardService: IndustryDashboardService) { }

  ngOnInit() {
    this.industryDashboardService.getName().subscribe({
      next: (data: any) => {
        this.userName = data.success.name;
      }
    });
  }
}
