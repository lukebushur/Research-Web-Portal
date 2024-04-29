import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditJobProjectComponent } from './add-edit-job-project.component';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddEditJobProjectComponent', () => {
  let component: AddEditJobProjectComponent;
  let fixture: ComponentFixture<AddEditJobProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AddEditJobProjectComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([]),
      ]
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
