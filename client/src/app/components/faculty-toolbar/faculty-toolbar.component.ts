import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavChoice } from 'app/_models/toolbar/navchoice';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-faculty-toolbar',
  templateUrl: './faculty-toolbar.component.html',
  styleUrls: ['./faculty-toolbar.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    MatSidenavModule,
    MatListModule,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class FacultyToolbarComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  // routes that the faculty user can navigate to via the sidenav
  navigationChoices: NavChoice[] = [
    {
      name: 'Dashboard',
      link: '/faculty/dashboard',
      icon: 'dashboard',
    },
    {
      name: 'Create Project',
      link: '/faculty/create-project',
      icon: 'add',
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
