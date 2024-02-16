import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOpportunitesSearchPageComponent } from './student-opportunites-search-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('StudentOpportunitesSearchPageComponent', () => {
  let component: StudentOpportunitesSearchPageComponent;
  let fixture: ComponentFixture<StudentOpportunitesSearchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentOpportunitesSearchPageComponent],
      imports: [HttpClientTestingModule, FormsModule],
    });
    fixture = TestBed.createComponent(StudentOpportunitesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
