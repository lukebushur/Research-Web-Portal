import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { SpinnerComponent } from './components/spinner/spinner.component'
import { LoadingInterceptor } from './loading.interceptor';
import { TableDataSharingService } from './_helpers/table-data-sharing/table-data-sharing.service';
import { SignoutComponent } from './components/signout/signout.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewApplicationComponent } from './components/view-application/view-application.component';
import { IndustryDashboardComponent } from './components/industry-dashboard/industry-dashboard.component';
import { AddEditJobComponent } from './components/add-edit-job/add-edit-job.component';
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
import { PageNotFoundScreenComponent } from './components/page-not-found-screen/page-not-found-screen.component';
import { ApplyToPostComponent } from './components/apply-to-post/apply-to-post.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmResetPasswordComponent } from './components/confirm-reset-password/confirm-reset-password.component';
import { ForgotPasswordSubmittedComponent } from './components/forgot-password-submitted/forgot-password-submitted.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { EditProfileScreenComponent } from './components/edit-profile-screen/edit-profile-screen.component';
import { StudentViewApplicationComponent } from './components/student-view-application/student-view-application.component';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { StudentApplicationsOverviewComponent } from './components/student-applications-overview/student-applications-overview.component';
import { AssessmentBrowserComponent } from './components/assessment-browser/assessment-browser.component';
import { AddEditAssessmentComponent } from './components/add-edit-assessment/add-edit-assessment.component';
import { CreateQuestionsFormComponent } from './components/create-questions-form/create-questions-form.component';
import { AssessmentCardComponent } from './components/assessment-browser/assessment-card/assessment-card.component';
import { MatStepperModule } from '@angular/material/stepper';
import { AssessmentChooserComponent } from './components/add-edit-job/assessment-chooser/assessment-chooser.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SignupComponent,
    FacultyDashboardComponent,
    ResearchProjectCardComponent,
    LoginComponent,
    FacultyToolbarComponent,
    AppliedStudentTableComponent,
    PostProjectComponent,
    SpinnerComponent,
    SignoutComponent,
    ViewApplicationComponent,
    IndustryDashboardComponent,
    AddEditJobComponent,
    IndustryToolbarComponent,
    JobCardComponent,
    StudentDashboard,
    ViewProjectComponent,
    StudentOpportunitesSearchPageComponent,
    PageNotFoundScreenComponent,
    ApplyToPostComponent,
    ForgotPasswordComponent,
    ConfirmResetPasswordComponent,
    ForgotPasswordSubmittedComponent,
    EditProfileScreenComponent,
    StudentViewApplicationComponent,
    StudentApplicationsOverviewComponent,
    AssessmentBrowserComponent,
    AddEditAssessmentComponent,
    CreateQuestionsFormComponent,
    AssessmentCardComponent,
    AssessmentChooserComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
    TableDataSharingService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }