import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientSignupComponent } from './patient-signup/patient-signup.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OtpSigninComponent } from './otp-signin/otp-signin.component';

@NgModule({
  declarations: [
    SigninComponent,
    PatientSignupComponent,
    UserManagementComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    OtpSigninComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    OwlModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    ChangePasswordComponent
  ]
})
export class AuthModule { }
