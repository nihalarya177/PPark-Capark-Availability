import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { StartpageComponent } from './components/startpage/startpage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetEmailComponent } from './components/reset-email/reset-email.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  {path:'',component: StartpageComponent},
  {path:'register',component: RegisterComponent},
  {path:'homepage',component: HomepageComponent},
  {path:'navbar',component: NavbarComponent},
  {path:'prof', component: ProfileComponent},
  {path: 'forgot_password', component: ForgotPasswordComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'reset-email', component: ResetEmailComponent},
  {path: 'change-password', component: ChangePasswordComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
