import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthenticationRouting } from './authentication-routing.module';



@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  imports: [
    AuthenticationRouting,
    CommonModule
  ]
})
export class AuthenticationModule { }
