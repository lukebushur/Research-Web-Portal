import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmEmailComponent } from './components/confirmemail/email.component';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard.component';
import { AuthGuard } from './_helpers/auth/auth-guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ApplyToOpp } from './components/apply-to-post/apply-to-post.component';
import { PostProjectComponent } from './components/post_creation/posts.component';
import { FacultyDashboardApplyComponent } from './components/faculty-accept/accept.component';
import { DemoProjectsComponent } from './components/demoProjects/demoProject.component';
import { SignoutComponent } from './components/signout/signout.component';
import { ViewApplicationComponent } from './components/view-application/view-application.component';

const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'faculty-dashboard', component: FacultyDashboardComponent, canActivate: [AuthGuard] },
  { path: "confirm-email/:emailtoken", component: ConfirmEmailComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "apply-to-post", component: ApplyToOpp, canActivate: [AuthGuard] },
  { path: "create-post", component: PostProjectComponent, canActivate: [AuthGuard] },
  { path: "project/applications", component: FacultyDashboardApplyComponent, canActivate: [AuthGuard] },
  { path: "demoProjects", component: DemoProjectsComponent },
  { path: "signout", component: SignoutComponent },
  //This route has two URL parameters, one for projectID, and one for applicationID. It is used to access a specific applicant's data by the faculty
  { path: "application/:projectID/:applicationID", component: ViewApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
