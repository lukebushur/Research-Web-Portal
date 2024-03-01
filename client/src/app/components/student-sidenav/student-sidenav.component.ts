import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavChoice } from './navchoice';
import { MatListModule } from '@angular/material/list'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-student-sidenav',
  templateUrl: './student-sidenav.component.html',
  styleUrls: ['./student-sidenav.component.css']
})
export class StudentSidenavComponent {

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);



  private _mobileQueryListener: () => void;

  navChoices: NavChoice[] = [
    {
      name: 'Dashboard',
      link: '/students/dashboard',
      icon: '',      
    },
    {
      name: 'Research',
      link: '/students/research',
      icon: '',      
    },
    {
      name: 'Jobs',
      link: '/students/jobs',
      icon: '',      
    },
    {
      name: 'Applications',
      link: '/students/applications',
      icon: '',      
    }
  ];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
