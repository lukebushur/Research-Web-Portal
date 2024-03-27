import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { PageNotFoundScreenComponent } from './page-not-found-screen.component';
import { By } from '@angular/platform-browser';

describe('PageNotFoundScreenComponent', () => {
  let component: PageNotFoundScreenComponent;
  let fixture: ComponentFixture<PageNotFoundScreenComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageNotFoundScreenComponent],
      providers: [provideRouter([
        { path: "**", component: PageNotFoundScreenComponent },
      ])]
    });
    fixture = TestBed.createComponent(PageNotFoundScreenComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the 404 message for an incorrect route', () => {
    router.navigate(['/incorrect-route']);
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('h2')).nativeElement.textContent;
    expect(errorMessage).toContain('Oops! Page Not Found');
  });

});
