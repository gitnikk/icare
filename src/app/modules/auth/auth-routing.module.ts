import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppRouteUrls } from '../../shared/enums/app-route-urls.enum';
import { SigninComponent } from './signin/signin.component';
import { PatientSignupComponent } from './patient-signup/patient-signup.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpSigninComponent } from './otp-signin/otp-signin.component';


const loginRoutes: Routes = [   
  {
      path: "",
      component: SigninComponent
  },
  {
      path: AppRouteUrls.LOGIN,
      component: SigninComponent
  },
  {
      path: AppRouteUrls.OTP_LOGIN,
      component: OtpSigninComponent
  },
  {
      path: AppRouteUrls.PATIENT_SIGNUP,
      component: PatientSignupComponent
  },
  {
      path: AppRouteUrls.USER_ACTION,
      component: UserManagementComponent
  },
  {
      path: AppRouteUrls.FORGOT_PASSWORD,
      component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
