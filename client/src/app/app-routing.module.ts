import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmEmailComponent } from './confirmemail/email.component';
import { FacultyDashboardComponent } from './faculty-dashboard/faculty-dashboard.component';
import { AuthGuard } from './auth/auth-guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { PostProjectComponent } from './post_creation/posts.component';

const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'faculty-dashboard', component: FacultyDashboardComponent, canActivate: [AuthGuard]},
  { path: "confirm-email/:emailtoken", component: ConfirmEmailComponent, canActivate: [AuthGuard]},
  { path: "login", component: LoginComponent},
  { path: "create-post", component: PostProjectComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
