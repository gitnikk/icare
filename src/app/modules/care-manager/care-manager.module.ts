import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CMDashboardComponent } from "./cm-dashboard/cm-dashboard.component";
import { CMRoutingModule } from "./care-manager-routing";
import { MatPaginatorModule } from '@angular/material';
import { CmCaselistComponent } from './cm-caselist/cm-caselist.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaseDetailsComponent } from './case-details/case-details.component';
import { CmProfileComponent } from './cm-profile/cm-profile.component';

@NgModule({
  declarations: [
    CMDashboardComponent, 
    CmCaselistComponent, CaseDetailsComponent, CmProfileComponent
  ],
  imports: [
    CommonModule, 
    CMRoutingModule, 
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
  ],
})
export class CareManagerModule {}
