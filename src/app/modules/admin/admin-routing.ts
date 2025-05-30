import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";
import { CareManagerListComponent } from "./care-manager-list/care-manager-list.component";
import { OnboardCareManagerComponent } from "./onboard-care-manager/onboard-care-manager.component";
import { OnboardDoctorComponent } from "./onboard-doctor/onboard-doctor.component";
import { AppRouteUrls } from "../../shared/enums/app-route-urls.enum";
import { CaseAllocationComponent } from './case-allocation/case-allocation.component';
import { CaseListComponent } from './case-list/case-list.component';
import { CmEditComponent } from './cm-edit/cm-edit.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { EarningManagementComponent } from './earning-management/earning-management.component';

const AdminRoutes: Routes = [
  {
    path: AppRouteUrls.ADMIN_DASHBOARD,
    component: AdminDashboardComponent,
  },
  {
    path: AppRouteUrls.DOCTORS_LIST,
    component: DoctorListComponent,
  },
  {
    path: AppRouteUrls.CARE_MANAGERS_LIST,
    component: CareManagerListComponent,
  },
  {
    path: AppRouteUrls.ONBOARD_CARE_MANAGER,
    component: OnboardCareManagerComponent,
  },
  {
    path: AppRouteUrls.ONBOARD_DOCTOR,
    component: OnboardDoctorComponent,
  },
  {
    path: AppRouteUrls.CASE_LIST,
    component: CaseListComponent,
  },
  {
    path: AppRouteUrls.CASE_ALLOCATION+"/:id",
    component: CaseAllocationComponent,
  },
  {
    path: AppRouteUrls.CM_EDIT+"/:id",
    component: CmEditComponent,
  },
  {
    path: AppRouteUrls.DOCTOR_EDIT+"/:id",
    component: DoctorEditComponent,
  },
  {
    path: AppRouteUrls.MY_PROFILE,
    component: AdminProfileComponent,
  },
  {
    path: AppRouteUrls.CM_EDIT+"/:id",
    component: CmEditComponent,
  },
  {
    path: AppRouteUrls.CHANGE_PASSWORD,
    component: ChangePasswordComponent,
  },
  {
    path: AppRouteUrls.EARNING_MANAGEMENT,
    component: EarningManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
