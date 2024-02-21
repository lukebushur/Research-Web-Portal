import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToPostComponent } from './apply-to-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

describe('ApplyToPostComponent', () => {
  let component: ApplyToPostComponent;
  let fixture: ComponentFixture<ApplyToPostComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyToPostComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatListModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(ApplyToPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
