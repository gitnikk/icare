import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DoctorsDashboardComponent } from "./doctors-dashboard/doctors-dashboard.component";
import { AppRouteUrls } from 'src/app/shared/enums/app-route-urls.enum';
import { DoctorCaselistComponent } from './doctor-caselist/doctor-caselist.component';
import { DoctorCaseDetailsComponent } from './doctor-case-details/doctor-case-details.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';

const DoctorRoutes: Routes = [
  {
    path: AppRouteUrls.DOCTOR_DASHBOARD,
    component: DoctorsDashboardComponent,
  },
  {
    path: AppRouteUrls.CASE_LIST,
    component: DoctorCaselistComponent,
  },
  {
    path: AppRouteUrls.CASE_DETAILS+"/:id",
    component: DoctorCaseDetailsComponent,
  },
  {
    path: AppRouteUrls.DOCTOR_PROFILE,
    component: DoctorProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(DoctorRoutes)],
  exports: [RouterModule],
})
export class DoctorRoutingModule {}
