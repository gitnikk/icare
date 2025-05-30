import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AdminRoutingModule } from "./admin-routing";

import { ChartsModule } from "@progress/kendo-angular-charts";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";
import { CareManagerListComponent } from "./care-manager-list/care-manager-list.component";
import { OnboardCareManagerComponent } from "./onboard-care-manager/onboard-care-manager.component";
import { AppMaterialModule } from "src/app/app-material.module";
import { OnboardDoctorComponent } from "./onboard-doctor/onboard-doctor.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CaseAllocationComponent } from './case-allocation/case-allocation.component';
import { CaseListComponent } from './case-list/case-list.component';
import { MatPaginatorModule } from '@angular/material';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CmEditComponent } from './cm-edit/cm-edit.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { DataTablesModule } from 'angular-datatables';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { AuthModule } from '../auth/auth.module';
import { EarningManagementComponent } from './earning-management/earning-management.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DoctorListComponent,
    CareManagerListComponent,
    OnboardCareManagerComponent,
    OnboardDoctorComponent,
    CaseAllocationComponent,
    CaseListComponent,
    CmEditComponent,
    AdminProfileComponent,
    DoctorEditComponent,
    EarningManagementComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ChartsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    DataTablesModule,
    AuthModule,
    TooltipModule.forRoot(),
  ],
})
export class AdminModule {}
