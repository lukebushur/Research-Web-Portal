import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';

import { IndustryDashboardComponent } from './industry-dashboard.component';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({ standalone: true, selector: 'app-faculty-toolbar', template: '' })
class FacultyToolbarStubComponent {}

describe('IndustryDashboardComponent', () => {
  let component: IndustryDashboardComponent;
  let fixture: ComponentFixture<IndustryDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustryDashboardComponent],
      imports: [
        HttpClientTestingModule,
        FacultyToolbarStubComponent,
        MatTabsModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(IndustryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
