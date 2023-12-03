import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyToolbarComponent } from './faculty-toolbar.component';

describe('FacultyToolbarComponent', () => {
  let component: FacultyToolbarComponent;
  let fixture: ComponentFixture<FacultyToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacultyToolbarComponent]
    });
    fixture = TestBed.createComponent(FacultyToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
