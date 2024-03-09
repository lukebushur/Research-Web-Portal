import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOpportunitesSearchPageComponent } from './student-opportunites-search-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';

describe('StudentOpportunitesSearchPageComponent', () => {
  let component: StudentOpportunitesSearchPageComponent;
  let fixture: ComponentFixture<StudentOpportunitesSearchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentOpportunitesSearchPageComponent],
      imports: [HttpClientTestingModule, FormsModule, MatFormFieldModule, CdkAccordionModule, FormsModule, MatInputModule, BrowserAnimationsModule, MatPaginatorModule, MatExpansionModule],
    });
    fixture = TestBed.createComponent(StudentOpportunitesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
