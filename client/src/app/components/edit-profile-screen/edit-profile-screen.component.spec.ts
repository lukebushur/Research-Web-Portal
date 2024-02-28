import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileScreenComponent } from './edit-profile-screen.component';

describe('EditProfileScreenComponent', () => {
  let component: EditProfileScreenComponent;
  let fixture: ComponentFixture<EditProfileScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfileScreenComponent]
    });
    fixture = TestBed.createComponent(EditProfileScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
