import { TestBed } from '@angular/core/testing';
import { ApplyToOpp } from './apply-to-post.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyToOpp],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ApplyToOpp);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'applyToOpp' title`, () => {
    const fixture = TestBed.createComponent(ApplyToOpp);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('applyToOpp');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(ApplyToOpp);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('First Opportunity');
  });
});
