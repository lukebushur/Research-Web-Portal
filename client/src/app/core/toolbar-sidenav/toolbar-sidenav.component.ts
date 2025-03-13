import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { environment } from 'environments/environment';
import { facultyNavList, industryNavList, studentNavList } from '../data/user-navigation-lists';
import { AuthService } from 'app/auth/auth-service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar-sidenav',
  templateUrl: './toolbar-sidenav.component.html',
  styleUrls: ['./toolbar-sidenav.component.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ]
})
export class ToolbarSidenavComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  readonly facultyNavList = facultyNavList;
  readonly studentNavList = studentNavList;
  readonly industryNavList = industryNavList;

  private subscription: Subscription;

  readonly isFaculty = signal(false);
  readonly isStudent = signal(false);
  readonly isIndustry = signal(false);
  readonly isNotAuthed = computed(() => {
    return !(this.isFaculty() || this.isStudent() || this.isIndustry());
  });

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private snackbar: MatSnackBar,
    private authService: AuthService,
  ) {
    // Keeps track of the max-width of the browser that the web portal is running
    // in. If it is less than 600px, then the mobile view is in use where the
    // sidenav is overlayed on top of the inner content when the navigation list
    // is active. If it is greater than 600px, then the desktop view is in use,
    // where the sidenav pushes the inner content to the side to make room for
    // the navigation list (when it is active).
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.subscription = this.authService.isAuthenticated().subscribe({
      next: (authenticated: boolean) => {
        if (!authenticated) {
          this.setUserType(false, false, false);
          return;
        }

        this.authService.getAccountInfo().subscribe({
          next: (value) => {
            const userType = value.success?.accountData?.userType;

            if (userType === environment.facultyType) {
              this.setUserType(true, false, false);
            } else if (userType === environment.studentType) {
              this.setUserType(false, true, false);
            } else if (userType === environment.industryType) {
              this.setUserType(false, false, true);
            }
          }
        });
      },
    });
  }

  private setUserType(
    isFaculty: boolean,
    isStudent: boolean,
    isIndustry: boolean
  ) {
    this.isFaculty.set(isFaculty);
    this.isStudent.set(isStudent);
    this.isIndustry.set(isIndustry);
  }

  signout(): void {
    this.authService.signout();

    this.router.navigateByUrl('/login').then((navigated: boolean) => {
      if (navigated) {
        this.snackbar.open('You have been successfully signed out!', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscription.unsubscribe();
  }
}
