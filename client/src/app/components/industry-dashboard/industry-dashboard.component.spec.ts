import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';

import { IndustryDashboardComponent } from './industry-dashboard.component';
import { Component } from '@angular/core';

@Component({ standalone: true, selector: 'app-faculty-toolbar', template: '' })
class FacultyToolbarStubComponent {}

describe('IndustryDashboardComponent', () => {
  let component: IndustryDashboardComponent;
  let fixture: ComponentFixture<IndustryDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustryDashboardComponent],
      imports: [HttpClientTestingModule, FacultyToolbarStubComponent],
    });
    fixture = TestBed.createComponent(IndustryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
