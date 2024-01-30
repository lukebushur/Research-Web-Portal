import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PostProjectComponent } from './posts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

describe('PostProjectComponent', () => {
  let component: PostProjectComponent;
  let fixture: ComponentFixture<PostProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostProjectComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatRadioModule,
        FormsModule,
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