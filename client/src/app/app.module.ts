import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmEmailComponent } from './confirmemail/email.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { FacultyDashboardComponent } from './faculty-dashboard/faculty-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ResearchProjectCardComponent } from './research-project-card/research-project-card.component';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { FacultyToolbarComponent } from './faculty-toolbar/faculty-toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AppliedStudentTableComponent } from './applied-student-table/applied-student-table.component';
import { MatSortModule } from '@angular/material/sort';
import { ApplyToOpp } from './apply-to-post/apply-to-post.component';
import { OpportunityComponent } from './apply-to-post/opportunity/opportunity.component';
import { ImageComponent } from './apply-to-post/image/image.component';
import { TextFieldComponent } from './apply-to-post/text-field/text-field.component';
import { PostProjectComponent } from './post_creation/posts.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FacultyDashboardApplyComponent } from './faculty-accept/accept.component';
import { DemoProjectsComponent } from './demoProjects/demoProject.component';
import { SpinnerComponent } from './spinner/spinner.component'
import { LoadingInterceptor } from './loading.interceptor';
import { TableDataSharingService } from './_helpers/table-data-sharing/table-data-sharing.service';
import { AutoSignUpComponent } from './auto-sign-up-component/auto-sign-up-component.component';
import { SignoutComponent } from './signout/signout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    ConfirmEmailComponent,
    HeaderBarComponent,
    FacultyDashboardComponent,
    ResearchProjectCardComponent,
    LoginComponent,
    FacultyToolbarComponent,
    AppliedStudentTableComponent,
    PostProjectComponent,
    FacultyDashboardApplyComponent,
    DemoProjectsComponent,
    SpinnerComponent,
    AutoSignUpComponent,
    SignoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatSortModule,
    OpportunityComponent,
    ImageComponent,
    TextFieldComponent,
    MatDialogModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }, TableDataSharingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
