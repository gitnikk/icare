import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DoctorsDashboardComponent } from "./doctors-dashboard/doctors-dashboard.component";
import { DoctorRoutingModule } from "./doctor-routing";
import { MatPaginatorModule } from '@angular/material';
import { DoctorCaselistComponent } from './doctor-caselist/doctor-caselist.component';
import { DoctorCaseDetailsComponent } from './doctor-case-details/doctor-case-details.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';

@NgModule({
  declarations: [DoctorsDashboardComponent, DoctorCaselistComponent, DoctorCaseDetailsComponent, DoctorProfileComponent],
  imports: [
    CommonModule, 
    DoctorRoutingModule, 
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),],
})
export class DoctorModule {}
