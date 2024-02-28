import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavChoice } from 'src/app/_models/toolbar/navchoice';

@Component({
  selector: 'app-faculty-toolbar',
  templateUrl: './faculty-toolbar.component.html',
  styleUrls: ['./faculty-toolbar.component.css']
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
