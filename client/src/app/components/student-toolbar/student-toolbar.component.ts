import { ChangeDetectorRef, Component } from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';
import { NavChoice } from 'app/_models/toolbar/navchoice';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-toolbar',
  templateUrl: './student-toolbar.component.html',
  styleUrls: ['./student-toolbar.component.css'],
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class StudentToolbarComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  // routes that the student user can navigate to via the sidenav
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
    // Keeps track of the max-width of the browser that the web portal is running
    // in. If it is less than 600px, then the mobile view is in use where the
    // sidenav is overlayed on top of the inner content when the navigation list
    // is active. If it is greater than 600px, then the desktop view is in use,
    // where the sidenav pushes the inner content to the side to make room for
    // the active navigation list (when it is active).
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
