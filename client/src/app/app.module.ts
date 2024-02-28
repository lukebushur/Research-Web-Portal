import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmEmailComponent } from './components/confirmemail/email.component';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ResearchProjectCardComponent } from './components/research-project-card/research-project-card.component';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { FacultyToolbarComponent } from './components/faculty-toolbar/faculty-toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AppliedStudentTableComponent } from './components/applied-student-table/applied-student-table.component';
import { MatSortModule } from '@angular/material/sort';
import { PostProjectComponent } from './components/post_creation/posts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FacultyDashboardApplyComponent } from './components/faculty-accept/accept.component';
import { DemoProjectsComponent } from './components/demoProjects/demoProject.component';
import { SpinnerComponent } from './components/spinner/spinner.component'
import { LoadingInterceptor } from './loading.interceptor';
import { TableDataSharingService } from './_helpers/table-data-sharing/table-data-sharing.service';
import { AutoSignUpComponent } from './components/auto-sign-up-component/auto-sign-up-component.component';
import { SignoutComponent } from './components/signout/signout.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CatergoryFieldComponent } from './components/post_creation/catergory-field/catergory-field.component';
import { ViewApplicationComponent } from './components/view-application/view-application.component';
import { IndustryDashboardComponent } from './components/industry-dashboard/industry-dashboard.component';
import { CustomQuestionComponent } from './components/post_creation/custom-question/custom-question.component';
import { CreateJobComponent } from './components/create-job/create-job.component';
import { StudentDashboard } from './components/student-dashboard/dashboard.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { IndustryToolbarComponent } from './components/industry-toolbar/industry-toolbar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { JobCardComponent } from './components/industry-dashboard/job-card/job-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewProjectComponent } from './components/view-project/view-project.component';
import { MatSelectModule } from '@angular/material/select';
import { StudentOpportunitesSearchPageComponent } from './components/student-opportunites-search-page/student-opportunites-search-page.component';
import { ApplyToPostComponent } from './components/apply-to-post/apply-to-post.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmResetPasswordComponent } from './components/confirm-reset-password/confirm-reset-password.component';
import { ForgotPasswordSubmittedComponent } from './components/forgot-password-submitted/forgot-password-submitted.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    ConfirmEmailComponent,
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
    SignoutComponent,
    CatergoryFieldComponent,
    ViewApplicationComponent,
    IndustryDashboardComponent,
    CustomQuestionComponent,
    CreateJobComponent,
    IndustryToolbarComponent,
    JobCardComponent,
    StudentDashboard,
    ViewProjectComponent,
    StudentOpportunitesSearchPageComponent,
    ApplyToPostComponent,
    ForgotPasswordComponent,
    ConfirmResetPasswordComponent,
    ForgotPasswordSubmittedComponent,
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
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatProgressBarModule,
    CdkAccordionModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }, TableDataSharingService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
