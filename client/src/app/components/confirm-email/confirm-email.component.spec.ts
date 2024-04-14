import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmailService } from 'src/app/controllers/email-controller/email.service';
import { ConfirmEmailComponent } from './confirm-email.component';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let emailService : EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    emailService = TestBed.inject(EmailService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call emailservice.confirmEmail() on ngOnInit', () => {
    const spy = spyOn(emailService, 'confirmEmail');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
