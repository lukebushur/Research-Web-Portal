import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileScreenComponent } from './edit-profile-screen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthService } from 'src/app/controllers/auth-controller/auth.service';

describe('EditProfileScreenComponent', () => {
  let component: EditProfileScreenComponent;
  let fixture: ComponentFixture<EditProfileScreenComponent>;
  let getMajorsSpy: jasmine.Spy;
  const getMajorsResponse = {
    success: {
      majors: [
        'Computer Science',
        'Mathematics',
        'Biology',
      ]
    }
  };

  beforeEach(() => {
    const authService = jasmine.createSpyObj('AuthService', ['getMajors']);
    getMajorsSpy = authService.getMajors.and.returnValue(Promise.resolve(of(getMajorsResponse)));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        EditProfileScreenComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
      ]
    });
    fixture = TestBed.createComponent(EditProfileScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
