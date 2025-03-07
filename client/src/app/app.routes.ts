import { Routes } from "@angular/router";
import { authGuard } from "./core/auth-guard/auth.guard";
import { roleGuard } from "./core/role-guard/role.guard";
import { AddEditAssessmentComponent } from "./components/add-edit-assessment/add-edit-assessment.component";
import { AddEditJobComponent } from "./components/add-edit-job/add-edit-job.component";
import { ApplyToPostComponent } from "./components/apply-to-post/apply-to-post.component";
import { AssessmentBrowserComponent } from "./components/assessment-browser/assessment-browser.component";
import { ConfirmEmailComponent } from "./components/confirm-email/confirm-email.component";
import { ConfirmResetPasswordComponent } from "./components/confirm-reset-password/confirm-reset-password.component";
import { EditProfileScreenComponent } from "./components/edit-profile-screen/edit-profile-screen.component";
import { FacultyDashboardComponent } from "./components/faculty-dashboard/faculty-dashboard.component";
import { FacultyToolbarComponent } from "./components/faculty-toolbar/faculty-toolbar.component";
import { ForgotPasswordSubmittedComponent } from "./components/forgot-password-submitted/forgot-password-submitted.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { IndustryDashboardComponent } from "./components/industry-dashboard/industry-dashboard.component";
import { IndustryToolbarComponent } from "./components/industry-toolbar/industry-toolbar.component";
import { LoginComponent } from "./components/login/login.component";
import { PageNotFoundScreenComponent } from "./components/page-not-found-screen/page-not-found-screen.component";
import { PostProjectComponent } from "./components/post_creation/posts.component";
import { SignoutComponent } from "./components/signout/signout.component";
import { SignupComponent } from "./components/signup/signup.component";
import { StudentApplicationsOverviewComponent } from "./components/student-applications-overview/student-applications-overview.component";
import { StudentDashboard } from "./components/student-dashboard/dashboard.component";
import { StudentOpportunitesSearchPageComponent } from "./components/student-opportunites-search-page/student-opportunites-search-page.component";
import { StudentToolbarComponent } from "./components/student-toolbar/student-toolbar.component";
import { StudentViewApplicationComponent } from "./components/student-view-application/student-view-application.component";
import { ViewApplicationComponent } from "./components/view-application/view-application.component";
import { ViewProjectComponent } from "./components/view-project/view-project.component";
import { StudentViewProjectComponent } from "./components/student-view-project/student-view-project.component";

const routeConfig: Routes = [

  // AUTHENTICATION ROUTES
  // Not specific to a user type
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signout', component: SignoutComponent },
  // 1 route parameter for the code allowing the user to confirm the account associated with their email
  { path: 'confirm-email/:emailToken', component: ConfirmEmailComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password-submitted', component: ForgotPasswordSubmittedComponent },
  // 2 route parameters: email associated with the account & uuid associated with the reset
  { path: 'confirm-reset-password/:email/:id', component: ConfirmResetPasswordComponent },

  // FACULTY ROUTES
  // Only accessible by faculty users
  {
    path: 'faculty', component: FacultyToolbarComponent, canActivate: [authGuard, roleGuard], data: { expectedRole: 'faculty' }, children: [
      { path: 'dashboard', component: FacultyDashboardComponent, canActivate: [authGuard] },
      { path: 'create-project', component: PostProjectComponent, canActivate: [authGuard] },
      // 2 route parameters for type of project and project ID
      { path: 'update-project/:projectType/:projectID', component: PostProjectComponent, canActivate: [authGuard] },
      // 2 route parameters for type of project and project ID
      // used to view a specific project's details and applicants
      { path: 'view-project/:projectType/:projectId', component: ViewProjectComponent },
      // 2 route parameters: one for the project ID of the project, and one for
      // the application ID of the project applicant. It is used to access a
      // specific applicant's data.
      { path: 'application/:projectID/:applicationID', component: ViewApplicationComponent },
      // edit a faculty user's details
      { path: 'edit-profile', component: EditProfileScreenComponent },
    ]
  },

  // STUDENT ROUTES
  // Only accessible by student users
  {
    path: 'student', component: StudentToolbarComponent, canActivate: [authGuard, roleGuard], data: { expectedRole: 'student' }, children: [
      { path: 'dashboard', component: StudentDashboard },
      // used to search the full list of all projects available for students
      { path: 'search-projects', component: StudentOpportunitesSearchPageComponent },
      // 3 query parameters: professor name, professor email, and project ID
      { path: 'apply-to-project', component: ApplyToPostComponent, canActivate: [authGuard] },
      // 1 route parameters for the application ID of the application to view
      // This route is to view a student's application to a project
      { path: 'view-application/:applicationID', component: StudentViewApplicationComponent },
      // used to view an overview of a student's applied projects
      { path: 'applications-overview', component: StudentApplicationsOverviewComponent },
      // 2 route parameters: professor email and project ID associated with a project
      // used to view an existing faculty project
      { path: 'view-project/:professorEmail/:projectId', component: StudentViewProjectComponent, canActivate: [authGuard] },
      // edit a student user's details
      { path: 'edit-profile', component: EditProfileScreenComponent },
    ],
  },

  // INDUSTRY ROUTES
  // Only accessible by industry users
  {
    path: 'industry', component: IndustryToolbarComponent, canActivate: [authGuard, roleGuard], data: { expectedRole: 'industry' }, children: [
      { path: 'dashboard', component: IndustryDashboardComponent },
      // create a new job
      { path: 'create-job', component: AddEditJobComponent },
      // 1 route parameter for the job ID of the job to edit
      // edit an existing job
      { path: 'edit-job/:jobId', component: AddEditJobComponent },
      // overview of the assessments that the industry user has created
      { path: 'assessments', component: AssessmentBrowserComponent },
      // create a new assessment
      { path: 'create-assessment', component: AddEditAssessmentComponent },
      // 1 route parameter for the assessment ID of the assessment to edit
      // edit an existing assessment
      { path: 'edit-assessment/:assessmentId', component: AddEditAssessmentComponent },
      // edit an industry user's details
      { path: 'edit-profile', component: EditProfileScreenComponent },
    ]
  },

  // LAST ROUTE - KEEP THIS ROUTE LAST FOR IT TO WORK
  // Catches any attempt to access a route that does not exist. It sends the
  // user a page notifying them that the route does not exist.
  { path: '**', component: PageNotFoundScreenComponent },
];

export default routeConfig;
