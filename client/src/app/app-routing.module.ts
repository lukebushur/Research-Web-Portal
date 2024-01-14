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
import { AutoSignUpComponent } from './auto-sign-up-component/auto-sign-up-component.component';
import { SignoutComponent } from './signout/signout.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
