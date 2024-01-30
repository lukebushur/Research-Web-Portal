import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatergoryFieldComponent } from './catergory-field.component';
import { FormsModule } from '@angular/forms';

describe('CatergoryFieldComponent', () => {
  let component: CatergoryFieldComponent;
  let fixture: ComponentFixture<CatergoryFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatergoryFieldComponent],
      imports: [
        FormsModule,
      ],
    });
    fixture = TestBed.createComponent(CatergoryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
