import { ChangeDetectorRef, Component } from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';
import { NavChoice } from 'src/app/_models/toolbar/navchoice';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-toolbar',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './student-toolbar.component.html',
  styleUrls: ['./student-toolbar.component.css']
})
export class StudentToolbarComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  navigationChoices: NavChoice[] = [
    {
      name: 'Dashboard',
      link: '/student/dashboard',
      icon: 'dashboard',
    },
    {
      name: 'Search Projects',
      link: '/student/search-projects',
      icon: 'search',
    },
    {
      name: 'Applications',
      link: '/student/applications-overview',
      icon: 'assignment',
    },
  ];

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
