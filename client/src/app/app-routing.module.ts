import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { PageNotFoundScreenComponent } from './components/page-not-found-screen/page-not-found-screen.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ConfirmResetPasswordComponent } from './components/confirm-reset-password/confirm-reset-password.component';
import { ForgotPasswordSubmittedComponent } from './components/forgot-password-submitted/forgot-password-submitted.component';
import { EditProfileScreenComponent } from './components/edit-profile-screen/edit-profile-screen.component';
import { FacultyToolbarComponent } from './components/faculty-toolbar/faculty-toolbar.component';
import { StudentViewApplicationComponent } from './components/student-view-application/student-view-application.component';
import { StudentApplicationsOverviewComponent } from './components/student-applications-overview/student-applications-overview.component';
import { AssessmentBrowserComponent } from './components/assessment-browser/assessment-browser.component';
import { AddEditAssessmentComponent } from './components/add-edit-assessment/add-edit-assessment.component';

const routes: Routes = [
  // AUTHENTICATION ROUTES
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signout', component: SignoutComponent },
  { path: 'confirm-email/:emailtoken', component: ConfirmEmailComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password-submitted', component: ForgotPasswordSubmittedComponent },
  // 2 route parameters: email associated with the account & uuid associated with the reset
  { path: 'confirm-reset-password/:email/:id', component: ConfirmResetPasswordComponent },

  // FACULTY ROUTES
  { path: 'faculty', component: FacultyToolbarComponent, canActivate: [AuthGuard], children: [
    { path: 'dashboard', component: FacultyDashboardComponent, canActivate: [AuthGuard] },
    { path: 'create-project', component: PostProjectComponent, canActivate: [AuthGuard] },
    // Route parameters for type of project and project ID
    { path: 'update-project/:projectType/:projectID', component: PostProjectComponent, canActivate: [AuthGuard] },
    // Takes a query parameter indicating the project to get applicants from
    { path: 'project/applications', component: FacultyDashboardApplyComponent, canActivate: [AuthGuard] },
    // This route is used to view a specific project and its applicants
    { path: 'viewProject/:projectType/:projectID', component: ViewProjectComponent },
    // This route has two URL parameters, one for projectID, and one for applicationID. It is used to access a specific applicant's data by the faculty
    { path: 'application/:projectID/:applicationID', component: ViewApplicationComponent },
  ]},

  // STUDENT ROUTES
  { path: 'student-dashboard', component: StudentDashboard },
  { path: 'student-search-opps', component: StudentSearchOppsComponent, canActivate: [AuthGuard] },
  // This route is used to view the full list of all opportunites available for students
  { path: 'student-opportunities', component: StudentOpportunitesSearchPageComponent },
  { path: 'apply-to-post', component: ApplyToPostComponent, canActivate: [AuthGuard] },
  //This route is to view an applicant from the student's view
  { path: 'studentViewApplication/:applicationID', component: StudentViewApplicationComponent},
  //This route is for students to view an overview of their applied projects
  { path: 'studentApplicationOverview', component: StudentApplicationsOverviewComponent},

  // INDUSTRY ROUTES
  { path: 'industry', component: IndustryToolbarComponent, canActivate: [AuthGuard], children: [
      { path: 'dashboard', component: IndustryDashboardComponent },
      { path: 'create-job', component: AddEditJobComponent },
      { path: 'edit-job/:jobId', component: AddEditJobComponent },
      { path: 'assessments', component: AssessmentBrowserComponent },
      { path: 'create-assessment', component: AddEditAssessmentComponent },
      { path: 'edit-assessment/:assessmentId', component: AddEditAssessmentComponent },
  ]},

  { path: 'edit-profile', component: EditProfileScreenComponent},
  // MISC. ROUTES
  { path: 'demoProjects', component: DemoProjectsComponent },
  
  // LAST ROUTE - KEEP THIS ROUTE LAST FOR IT TO WORK
  { path: '**', component: PageNotFoundScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
