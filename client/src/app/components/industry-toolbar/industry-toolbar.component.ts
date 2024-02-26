import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavChoice } from '../../_models/toolbar/navchoice';

@Component({
  selector: 'app-industry-toolbar',
  templateUrl: './industry-toolbar.component.html',
  styleUrls: ['./industry-toolbar.component.css']
})
export class IndustryToolbarComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  navigationChoices: NavChoice[] = [
    {
      name: 'Dashboard',
      link: '/industry/dashboard',
      icon: 'dashboard',      
    },
    {
      name: 'Create Job',
      link: '/industry/create-job',
      icon: 'add',      
    },
    {
      name: 'Assessments',
      link: '/industry/assessments',
      icon: 'quiz',
    },
  ];

  constructor(
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
