import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryToolbarComponent } from './industry-toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';

describe('IndustryToolbarComponent', () => {
  let component: IndustryToolbarComponent;
  let fixture: ComponentFixture<IndustryToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustryToolbarComponent],
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(IndustryToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a material toolbar', () => {
    const toolbarElement: HTMLElement = fixture.nativeElement;
    const toolbar = toolbarElement.querySelector('mat-toolbar')!;
    expect(toolbar).toBeTruthy();
    const toolbarSidenavButton = toolbarElement.querySelector('button')!;
    expect(toolbarSidenavButton.firstChild!.textContent).toContain('menu');
    const toolbarTitle = toolbarElement.querySelector('.title')!;
    expect(toolbarTitle.textContent).toEqual('Industry User');
    const toolbarAccountButton = toolbarElement.querySelectorAll('button')[1]!;
    expect(toolbarAccountButton.firstChild!.textContent).toEqual('account_circle');
  });

  it('should create a material sidenav', () => {
    const toolbarElement: HTMLElement = fixture.nativeElement;
    const sidenav = toolbarElement.querySelector('mat-sidenav-container')!;
    expect(sidenav).toBeTruthy();
    const sidenavOptions = toolbarElement.querySelector('mat-nav-list')!;
    expect(sidenavOptions.childElementCount).toEqual(2);
  });

  it('should open the account menu', () => {
    const toolbarElement: HTMLElement = fixture.nativeElement;
    const accountButton = toolbarElement.querySelectorAll('button')[1]!;    
    expect(accountButton.getAttribute('aria-expanded')).toEqual('false');
    accountButton.click();
    fixture.detectChanges();
    expect(accountButton.getAttribute('aria-expanded')).toEqual('true');
  });

  it('should open the sidnav', () => {
    const toolbarElement: HTMLElement = fixture.nativeElement;
    const sidenavContent = toolbarElement.querySelector('mat-sidenav')!;
    expect(sidenavContent.getAttribute('style')!.includes('visibility: hidden;')).toBeTrue();
    const sidenavButton = toolbarElement.querySelector('button')!;    
    sidenavButton.click();
    fixture.detectChanges();
    // expect(sidenavContent.getAttribute('style')).toEqual('');
  });
});
