import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentToolbarComponent } from './student-toolbar.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSidenavContainerHarness, MatSidenavHarness } from '@angular/material/sidenav/testing';
import { MatNavListHarness } from '@angular/material/list/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { provideRouter } from '@angular/router';

describe('StudentToolbarComponent', () => {
  let component: StudentToolbarComponent;
  let fixture: ComponentFixture<StudentToolbarComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StudentToolbarComponent,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        BrowserAnimationsModule,
      ],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(StudentToolbarComponent);
    // loader for Material component testing
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
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
    expect(await (await accountMenu.getItems())[0].getText()).toContain('Log Out');
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
});
