import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyToolbarComponent } from './faculty-toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

describe('FacultyToolbarComponent', () => {
  let component: FacultyToolbarComponent;
  let fixture: ComponentFixture<FacultyToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacultyToolbarComponent],
      imports: [MatToolbarModule, MatIconModule, MatMenuModule],
    });
    fixture = TestBed.createComponent(FacultyToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
