import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PostProjectComponent } from './posts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({ standalone: true, selector: 'app-spinner', template: '' })
class SpinnerSubComponent {}

describe('PostProjectComponent', () => {
  let component: PostProjectComponent;
  let fixture: ComponentFixture<PostProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostProjectComponent],
      imports: [
        SpinnerSubComponent,
        HttpClientTestingModule,
        MatDialogModule,
        MatRadioModule,
        FormsModule,
        RouterTestingModule,
      ],
    });
    fixture = TestBed.createComponent(PostProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});