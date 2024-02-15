import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSearchOppsComponent } from './student-search-opps.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StudentSearchOppsComponent', () => {
  let component: StudentSearchOppsComponent;
  let fixture: ComponentFixture<StudentSearchOppsComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StudentSearchOppsComponent,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(StudentSearchOppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the "studentSearchOpps" title', () => {
    expect(component.title).toEqual('studentSearchOpps');
  });
});
