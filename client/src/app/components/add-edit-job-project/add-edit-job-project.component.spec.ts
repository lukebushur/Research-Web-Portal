import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditJobProjectComponent } from './add-edit-job-project.component';

describe('AddEditJobProjectComponent', () => {
  let component: AddEditJobProjectComponent;
  let fixture: ComponentFixture<AddEditJobProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditJobProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditJobProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
