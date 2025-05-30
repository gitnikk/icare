import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppRouteUrls } from "./shared/enums/app-route-urls.enum";
import { AppAuthGuardGuard as AuthGuard } from './app-auth-guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: AppRouteUrls.ADMIN_MODULE,
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: AppRouteUrls.CARE_MANAGER_MODULE,
    loadChildren: () => import('./modules/care-manager/care-manager.module').then(m => m.CareManagerModule),
    canActivate: [AuthGuard]
  },
  {
    path: AppRouteUrls.DOCTOR_MODULE,
    loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule),
    canActivate: [AuthGuard]
  },
  {
    path: AppRouteUrls.PATIENT_MODULE,
    loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
