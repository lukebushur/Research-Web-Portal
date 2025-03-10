import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoutComponent } from './signout.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

describe('SignoutComponent', () => {
  let component: SignoutComponent;
  let fixture: ComponentFixture<SignoutComponent>;

  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(Promise.resolve(true));

    authService = jasmine.createSpyObj<AuthService>('AuthService', ['signout']);
    authService.signout;

    TestBed.configureTestingModule({
      imports: [
        SignoutComponent,
        MatSnackBarModule,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ]
    });
    fixture = TestBed.createComponent(SignoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and redirect', () => {
    expect(component).toBeTruthy();

    expect(authService.signout).withContext('signout called').toHaveBeenCalled();
    expect(router.navigateByUrl).withContext('navigate called').toHaveBeenCalledWith('/login');
  });
});
