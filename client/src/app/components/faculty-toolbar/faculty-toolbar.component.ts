import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavChoice } from 'src/app/_models/toolbar/navchoice';
import { NgFor } from '@angular/common';
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
    NgFor,
    RouterLinkActive,
    RouterOutlet,
  ]
})
export class FacultyToolbarComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

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
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
