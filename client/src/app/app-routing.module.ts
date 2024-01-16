import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmEmailComponent } from './confirmemail/email.component';
import { FacultyDashboardComponent } from './faculty-dashboard/faculty-dashboard.component';
import { AuthGuard } from './auth/auth-guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { ApplyToOpp } from './apply-to-post/apply-to-post.component';
import { PostProjectComponent } from './post_creation/posts.component';
import { FacultyDashboardApplyComponent } from './faculty-accept/accept.component';
import { DemoProjectsComponent  } from './demoProjects/demoProject.component';
import { SignoutComponent } from './signout/signout.component';
import { ViewApplicationComponent } from './view-application/view-application.component';

const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'faculty-dashboard', component: FacultyDashboardComponent, canActivate: [AuthGuard]},
  { path: "confirm-email/:emailtoken", component: ConfirmEmailComponent, canActivate: [AuthGuard]},
  { path: "login", component: LoginComponent},
  { path: "apply-to-post", component: ApplyToOpp, canActivate: [AuthGuard]},
  { path: "create-post", component: PostProjectComponent, canActivate: [AuthGuard]},
  { path: "project/applications", component: FacultyDashboardApplyComponent, canActivate: [AuthGuard]},
  { path: "demoProjects", component: DemoProjectsComponent },
  { path: "signout", component: SignoutComponent },
  //This route has two URL parameters, one for projectID, and one for applicationID. It is used to access a specific applicant's data by the faculty
  { path: "application/:projectID/:applicationID", component: ViewApplicationComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
