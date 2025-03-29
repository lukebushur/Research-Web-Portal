import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard/auth.guard';
import { roleGuard } from './core/role-guard/role.guard';
import { AddEditAssessmentComponent } from './industry/add-edit-assessment/add-edit-assessment.component';
import { AddEditJobComponent } from './industry/add-edit-job/add-edit-job.component';
import { ApplyToPostComponent } from './students/apply-to-post/apply-to-post.component';
import { AssessmentBrowserComponent } from './industry/assessment-browser/assessment-browser.component';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';
import { ConfirmResetPasswordComponent } from './auth/confirm-reset-password/confirm-reset-password.component';
import { EditProfileScreenComponent } from './core/edit-profile-screen/edit-profile-screen.component';
import { FacultyDashboardComponent } from './faculty/faculty-dashboard/faculty-dashboard.component';
import { ToolbarSidenavComponent } from './core/toolbar-sidenav/toolbar-sidenav.component';
import { ForgotPasswordSubmittedComponent } from './auth/forgot-password-submitted/forgot-password-submitted.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { IndustryDashboardComponent } from './industry/industry-dashboard/industry-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundScreenComponent } from './core/page-not-found-screen/page-not-found-screen.component';
import { PostProjectComponent } from './faculty/post_creation/posts.component';
import { SignupComponent } from './auth/signup/signup.component';
import { StudentApplicationsOverviewComponent } from './students/student-applications-overview/student-applications-overview.component';
import { StudentDashboard } from './students/student-dashboard/dashboard.component';
import { StudentOpportunitesSearchPageComponent } from './students/student-opportunites-search-page/student-opportunites-search-page.component';
import { StudentViewApplicationComponent } from './students/student-view-application/student-view-application.component';
import { ViewApplicationComponent } from './faculty/view-application/view-application.component';
import { ViewProjectComponent } from './faculty/view-project/view-project.component';
import { StudentViewProjectComponent } from './students/student-view-project/student-view-project.component';
import { NotifyConfirmEmailComponent } from './auth/notify-confirm-email/notify-confirm-email.component';

const routeConfig: Routes = [
  {
    path: '',
    component: ToolbarSidenavComponent,
    children: [
      // AUTHENTICATION ROUTES
      // Not specific to a user type
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'signup', component: SignupComponent },
      { path: 'login', component: LoginComponent },
      { path: 'notify-confirm-email', component: NotifyConfirmEmailComponent },
      // 1 route parameter for the code allowing the user to confirm the account associated with their email
      { path: 'confirm-email/:userId/:emailToken', component: ConfirmEmailComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'forgot-password-submitted', component: ForgotPasswordSubmittedComponent },
      // 2 route parameters: email associated with the account & uuid associated with the reset
      { path: 'confirm-reset-password/:email/:id', component: ConfirmResetPasswordComponent },
      // edit a user's details
      { path: 'edit-profile', component: EditProfileScreenComponent },

      // FACULTY ROUTES
      // Only accessible by faculty users
      {
        path: 'faculty', canActivate: [authGuard, roleGuard], data: { expectedRole: 'faculty' }, children: [
          { path: 'dashboard', component: FacultyDashboardComponent },
          { path: 'create-project', component: PostProjectComponent },
          // 2 route parameters for type of project and project ID
          { path: 'update-project/:projectType/:projectID', component: PostProjectComponent },
          // 2 route parameters for type of project and project ID
          // used to view a specific project's details and applicants
          { path: 'view-project/:projectType/:projectId', component: ViewProjectComponent },
          // 2 route parameters: one for the project ID of the project, and one for
          // the application ID of the project applicant. It is used to access a
          // specific applicant's data.
          { path: 'application/:projectID/:applicationID', component: ViewApplicationComponent },
        ]
      },

      // STUDENT ROUTES
      // Only accessible by student users
      {
        path: 'student', canActivate: [authGuard, roleGuard], data: { expectedRole: 'student' }, children: [
          { path: 'dashboard', component: StudentDashboard },
          // used to search the full list of all projects available for students
          { path: 'search-projects', component: StudentOpportunitesSearchPageComponent },
          // 3 query parameters: professor name, professor email, and project ID
          { path: 'apply-to-project', component: ApplyToPostComponent },
          // 1 route parameters for the application ID of the application to view
          // This route is to view a student's application to a project
          { path: 'view-application/:applicationID', component: StudentViewApplicationComponent },
          // used to view an overview of a student's applied projects
          { path: 'applications-overview', component: StudentApplicationsOverviewComponent },
          // 2 route parameters: professor email and project ID associated with a project
          // used to view an existing faculty project
          { path: 'view-project/:professorEmail/:projectId', component: StudentViewProjectComponent },
        ],
      },

      // INDUSTRY ROUTES
      // Only accessible by industry users
      {
        path: 'industry', canActivate: [authGuard, roleGuard], data: { expectedRole: 'industry' }, children: [
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
        ]
      },

      // LAST ROUTE - KEEP THIS ROUTE LAST FOR IT TO WORK
      // Catches any attempt to access a route that does not exist. It sends the
      // user a page notifying them that the route does not exist.
      { path: '**', component: PageNotFoundScreenComponent },
    ]
  },
];

export default routeConfig;
