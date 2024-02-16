import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectComponent } from './view-project.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent {}

describe('ViewProjectComponent', () => {
  let component: ViewProjectComponent;
  let fixture: ComponentFixture<ViewProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProjectComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SpinnerSubComponent,
        MatTableModule,
      ],
    });
    fixture = TestBed.createComponent(ViewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
