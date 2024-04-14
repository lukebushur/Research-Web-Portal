import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoutComponent } from './signout.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignoutService } from 'src/app/controllers/signout-controller/signout.service';

describe('SignoutComponent', () => {
  let component: SignoutComponent;
  let fixture: ComponentFixture<SignoutComponent>;
  let signoutSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    const signoutService = jasmine.createSpyObj('SignoutService', ['signout']);
    signoutSpy = signoutService.signout;

    const router = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [
        SignoutComponent,
        MatSnackBarModule,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: SignoutService, useValue: signoutService },
      ]
    });
    fixture = TestBed.createComponent(SignoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and redirect', () => {
    expect(component).toBeTruthy();
    expect(signoutSpy).withContext('signout called').toHaveBeenCalled();
    expect(navigateSpy).withContext('navigate called').toHaveBeenCalledWith(['/login']);
  });
});
