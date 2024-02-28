import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmEmailComponent } from './components/confirmemail/email.component';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard.component';
import { AuthGuard } from './_helpers/auth/auth-guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ApplyToPostComponent } from './components/apply-to-post/apply-to-post.component';
import { PostProjectComponent } from './components/post_creation/posts.component';
import { FacultyDashboardApplyComponent } from './components/faculty-accept/accept.component';
import { DemoProjectsComponent } from './components/demoProjects/demoProject.component';
import { SignoutComponent } from './components/signout/signout.component';
import { ViewApplicationComponent } from './components/view-application/view-application.component';
import { IndustryDashboardComponent } from './components/industry-dashboard/industry-dashboard.component';
import { AddEditJobComponent } from './components/add-edit-job/add-edit-job.component';
import { IndustryToolbarComponent } from './components/industry-toolbar/industry-toolbar.component';
import { StudentDashboard } from './components/student-dashboard/dashboard.component';
import { StudentSearchOppsComponent } from './components/student-search-opps/student-search-opps.component';
import { ViewProjectComponent } from './components/view-project/view-project.component';
import { StudentOpportunitesSearchPageComponent } from './components/student-opportunites-search-page/student-opportunites-search-page.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ConfirmResetPasswordComponent } from './components/confirm-reset-password/confirm-reset-password.component';
import { ForgotPasswordSubmittedComponent } from './components/forgot-password-submitted/forgot-password-submitted.component';
import { AssessmentBrowserComponent } from './components/assessment-browser/assessment-browser.component';
import { AddEditAssessmentComponent } from './components/add-edit-assessment/add-edit-assessment.component';

const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'faculty-dashboard', component: FacultyDashboardComponent, canActivate: [AuthGuard] },
  { path: 'confirm-email/:emailtoken', component: ConfirmEmailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password-submitted', component: ForgotPasswordSubmittedComponent },
  // 2 route parameters: email associated with the account & uuid associated with the reset
  { path: 'confirm-reset-password/:email/:id', component: ConfirmResetPasswordComponent },
  { path: 'apply-to-post', component: ApplyToPostComponent, canActivate: [AuthGuard] },
  { path: 'create-post/:projectType/:projectID', component: PostProjectComponent, canActivate: [AuthGuard] },
  { path: 'project/applications', component: FacultyDashboardApplyComponent, canActivate: [AuthGuard] },
  { path: 'demoProjects', component: DemoProjectsComponent },
  { path: 'signout', component: SignoutComponent },
  {
    path: 'industry',
    component: IndustryToolbarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: IndustryDashboardComponent },
      { path: 'create-job', component: AddEditJobComponent },
      { path: 'edit-job/:jobId', component: AddEditJobComponent },
      { path: 'assessments', component: AssessmentBrowserComponent },
      { path: 'create-assessment', component: AddEditAssessmentComponent },
      { path: 'edit-assessment/:assessmentId', component: AddEditAssessmentComponent },
    ],
  },
  //This route has two URL parameters, one for projectID, and one for applicationID. It is used to access a specific applicant's data by the faculty
  { path: 'application/:projectID/:applicationID', component: ViewApplicationComponent },
  { path: 'student-dashboard', component: StudentDashboard },
  { path: 'student-dashboard', component: StudentDashboard },
  { path: 'student-search-opps', component: StudentSearchOppsComponent, canActivate: [AuthGuard] },
  //This route is used to view a specific project and its applicants
  { path: 'viewProject/:projectType/:projectID', component: ViewProjectComponent },
  //this route is used to view the full list of all opportunites available for students
  { path: 'student-opportunities', component: StudentOpportunitesSearchPageComponent },
  //this route is used to view the full list of all opportunites available for students
  { path: 'student-opportunities', component: StudentOpportunitesSearchPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
