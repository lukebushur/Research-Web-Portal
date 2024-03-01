import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyApplicationListComponent } from './faculty-application-list.component';

describe('FacultyApplicationListComponent', () => {
  let component: FacultyApplicationListComponent;
  let fixture: ComponentFixture<FacultyApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacultyApplicationListComponent]
    });
    fixture = TestBed.createComponent(FacultyApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
