import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditProfileScreenComponent } from './edit-profile-screen.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileServiceService } from 'app/controllers/profile-controller/profile-service.service';
import { Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EditProfileScreenComponent', () => {
  let component: EditProfileScreenComponent;
  let fixture: ComponentFixture<EditProfileScreenComponent>;
  let profileService: ProfileServiceService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      teardown: { destroyAfterEach: false },
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        EditProfileScreenComponent
      ],
      providers: [
        ProfileServiceService,
        Router,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileScreenComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileServiceService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass GPA validators with valid input', () => {
    const testGpa = component.editProfileForm.get('GPA');
    testGpa?.setValue('3.5');
    expect(testGpa?.valid).toBeTruthy();
  });

  it('should not pass GPA validators with invalid input', () => {
    const testGpa = component.editProfileForm.get('GPA');
    testGpa?.setValue('5');
    expect(testGpa?.valid).toBeFalsy();
  });

  it('should navigate to email reset screen when reset password button is clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateToEmailResetScreen();
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot-password']);
  });

});
