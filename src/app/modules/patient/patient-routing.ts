import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateCaseComponent } from './create-case/create-case.component';
import { PatientCasesComponent } from './patient-cases/patient-cases.component';
import { AppRouteUrls } from 'src/app/shared/enums/app-route-urls.enum';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { FamilyMemberListComponent } from './family-member-list/family-member-list.component';
import { ManageFamilyMemberComponent } from './manage-family-member/manage-family-member.component';
import { PatientCaseDetailsComponent } from './patient-case-details/patient-case-details.component';
import { InhouseServiceComponent } from './inhouse-service/inhouse-service.component';

const PatientRoutes: Routes = [
  {
    path: AppRouteUrls.PATIENT_DASHBOARD,
    component: PatientCasesComponent,
  },
  {
    path: AppRouteUrls.CASE_LIST,
    component: PatientCasesComponent,
  },
  {
    path: AppRouteUrls.CREATE_CASE,
    component: CreateCaseComponent,
  },
  {
    path: AppRouteUrls.MY_PROFILE,
    component: MyProfileComponent,
  },
  {
    path: AppRouteUrls.FAMILY_MEMBER_LIST,
    component: FamilyMemberListComponent,
  },
  {
    path: AppRouteUrls.FAMILY_MEMBER_FORM,
    component: ManageFamilyMemberComponent,
  },
  {
    path: AppRouteUrls.FAMILY_MEMBER_FORM+"/:id",
    component: ManageFamilyMemberComponent,
  },
  {
    path: AppRouteUrls.CASE_DETAILS+"/:id",
    component: PatientCaseDetailsComponent,
  },
  {
    path: AppRouteUrls.MEDICAL_ADVICE,
    component: InhouseServiceComponent,
  },
  {
    path: AppRouteUrls.SECOND_OPINION,
    component: InhouseServiceComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(PatientRoutes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
