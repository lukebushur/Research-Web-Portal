import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyConfirmEmailComponent } from './notify-confirm-email.component';

describe('NotifyConfirmEmailComponent', () => {
  let component: NotifyConfirmEmailComponent;
  let fixture: ComponentFixture<NotifyConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifyConfirmEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifyConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
