import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionsFormComponent } from './create-questions-form.component';

describe('CreateQuestionsFormComponent', () => {
  let component: CreateQuestionsFormComponent;
  let fixture: ComponentFixture<CreateQuestionsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateQuestionsFormComponent]
    });
    fixture = TestBed.createComponent(CreateQuestionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
