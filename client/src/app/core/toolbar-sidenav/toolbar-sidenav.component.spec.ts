import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSidenavContainerHarness, MatSidenavHarness } from '@angular/material/sidenav/testing';
import { MatNavListHarness } from '@angular/material/list/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

import { ToolbarSidenavComponent } from './toolbar-sidenav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from 'app/auth/auth-service/auth.service';
import { of } from 'rxjs';
import { inject } from '@angular/core';

describe('ToolbarSidenavComponent', () => {
  let component: ToolbarSidenavComponent;
  let fixture: ComponentFixture<ToolbarSidenavComponent>;
  let loader: HarnessLoader;

  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'getAccountInfo',
      'isAuthenticated',
      'signout',
    ]);
    authService.getAccountInfo.and.returnValue(of({
      success: {
        accountData: {
          userType: 0,
        },
      },
    }));
    authService.isAuthenticated.and.returnValue(of(true));

    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        BrowserAnimationsModule,
        ToolbarSidenavComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ]
    });
    fixture = TestBed.createComponent(ToolbarSidenavComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a material toolbar', async () => {
    const toolbar = await loader.getHarness(MatToolbarHarness);
    expect((await toolbar.getRowsAsText())[0]).toContain('Research Web Portal');

    const toolbarLoader = await loader.getChildLoader('.toolbar');
    const [sidenavButton, accountButton] = await toolbarLoader.getAllHarnesses(MatButtonHarness);
    expect(await sidenavButton.getText()).toBe('menu');
    expect(await accountButton.getText()).toBe('account_circle');
  });

  it('should create a material sidenav', async () => {
    const sidenavContainer = await loader.getHarnessOrNull(MatSidenavContainerHarness);
    expect(sidenavContainer).not.toBeNull();

    const sidenavLoader = await loader.getChildLoader('mat-sidenav');
    const navList = await sidenavLoader.getHarness(MatNavListHarness);
    const navListItem = (await navList.getItems())[0];
    expect((await navList.getItems()).length).toBe(3);
    expect(await navListItem.getFullText()).toContain('');
  });

  it('should open the account menu', async () => {
    const toolbarLoader = await loader.getChildLoader('.toolbar');
    const accountMenu = await toolbarLoader.getHarness(MatMenuHarness);
    expect(await accountMenu.isOpen()).toBeFalse();

    const [_, accountButton] = await toolbarLoader.getAllHarnesses(MatButtonHarness);
    await accountButton.click();
    expect(await accountMenu.isOpen()).toBeTrue();
    expect(await (await accountMenu.getItems())[0].getText()).toContain('Edit Profile');
  });

  it('should open the sidnav', async () => {
    const sidenavContainer = (await loader.getHarnessOrNull(MatSidenavContainerHarness))!;
    const sidenav = await sidenavContainer.getHarness(MatSidenavHarness);
    expect(await sidenav.isOpen()).toBeFalse();

    const toolbarLoader = await loader.getChildLoader('.toolbar');
    const [sidenavButton, _] = await toolbarLoader.getAllHarnesses(MatButtonHarness);
    await sidenavButton.click();
    expect(await sidenav.isOpen()).toBeTrue();
  });

  it('signout should signout and redirect to login', async () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    navigateSpy.and.returnValue(Promise.resolve(true));

    component.signout();

    expect(authService.signout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledOnceWith('/login');
  });
});
