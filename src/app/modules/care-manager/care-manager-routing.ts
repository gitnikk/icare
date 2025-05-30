import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppRouteUrls } from 'src/app/shared/enums/app-route-urls.enum';
import { CMDashboardComponent } from "./cm-dashboard/cm-dashboard.component";
import { CmCaselistComponent } from './cm-caselist/cm-caselist.component';
import { CaseDetailsComponent } from './case-details/case-details.component';
import { CmProfileComponent } from './cm-profile/cm-profile.component';

const CareManagerRoutes: Routes = [
  {
    path: AppRouteUrls.CARE_MANAGER_DASHBOARD,
    component: CMDashboardComponent,
  },
  {
    path: AppRouteUrls.CASE_LIST,
    component: CmCaselistComponent,
  },
  {
    path: AppRouteUrls.CASE_DETAILS+"/:id",
    component: CaseDetailsComponent,
  },
  {
    path: AppRouteUrls.CM_PROFILE,
    component: CmProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(CareManagerRoutes)],
  exports: [RouterModule],
})
export class CMRoutingModule {}
