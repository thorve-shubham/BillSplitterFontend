import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';


const routes: Routes = [
  { path: 'auth',
    loadChildren: () =>
    import('./authentication/authentication.module').then((m) => m.AuthenticationModule) },
  { path : '' , redirectTo : "auth/login", pathMatch : 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
