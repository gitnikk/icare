import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PatientDashboardComponent } from "./patient-dashboard/patient-dashboard.component";
import { PatientRoutingModule } from "./patient-routing";
import { CreateCaseComponent } from './create-case/create-case.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientCasesComponent } from './patient-cases/patient-cases.component';
import { MatPaginatorModule } from '@angular/material';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { FamilyMemberListComponent } from './family-member-list/family-member-list.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ManageFamilyMemberComponent } from './manage-family-member/manage-family-member.component';
import { PatientCaseDetailsComponent } from './patient-case-details/patient-case-details.component';
import { DataTablesModule } from 'angular-datatables';
import { InhouseServiceComponent } from './inhouse-service/inhouse-service.component';

@NgModule({
  declarations: [PatientDashboardComponent, CreateCaseComponent, PatientCasesComponent, MyProfileComponent, FamilyMemberListComponent, ManageFamilyMemberComponent, PatientCaseDetailsComponent, InhouseServiceComponent],
  imports: [
    CommonModule,
    PatientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    DataTablesModule,
    TooltipModule.forRoot(),
  ],
})
export class PatientModule {}
