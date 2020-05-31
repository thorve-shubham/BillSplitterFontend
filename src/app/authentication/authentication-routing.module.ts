import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UnauthorizedService } from '../routeGuards/unauthorized.service';

const routes: Routes = [
  { path : 'login', component : LoginComponent ,canActivate : [UnauthorizedService]},
  { path : 'signup', component : SignUpComponent ,canActivate : [UnauthorizedService]},
  { path : 'forgotPassword', component : ForgotPasswordComponent, canActivate : [UnauthorizedService]},
  { path : 'changePassword/:authToken', component : ChangePasswordComponent , canActivate : [UnauthorizedService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRouting {}
