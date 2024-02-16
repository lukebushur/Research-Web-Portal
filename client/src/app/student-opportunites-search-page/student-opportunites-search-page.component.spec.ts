import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOpportunitesSearchPageComponent } from './student-opportunites-search-page.component';

describe('StudentOpportunitesSearchPageComponent', () => {
  let component: StudentOpportunitesSearchPageComponent;
  let fixture: ComponentFixture<StudentOpportunitesSearchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentOpportunitesSearchPageComponent]
    });
    fixture = TestBed.createComponent(StudentOpportunitesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
