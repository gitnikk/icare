import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpInterceptorService } from "./shared/services/common-services/http-interceptor.service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PatientModule } from "./modules/patient/patient.module";
import { CareManagerModule } from "./modules/care-manager/care-manager.module";
import { DoctorModule } from "./modules/doctor/doctor.module";
import { AdminModule } from "./modules/admin/admin.module";
import { SidenavComponent } from "./layout/sidenav/sidenav.component";
import { HeaderComponent } from "./layout/header/header.component";
import { ConfirmModalComponent } from './shared/common-components/confirm-modal/confirm-modal.component';
import { AppBootstrapModule } from "./app-bootstrap.module";

import { OwlModule } from "ngx-owl-carousel";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import "hammerjs";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { NgxSpinnerModule } from "ngx-spinner"; 
import { NgxBootstrapAlertNotificationModule } from "@benevideschissanga/ngx-bootstrap-alert-notification";


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HeaderComponent,
    ConfirmModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    PatientModule,
    CareManagerModule,
    DoctorModule,
    AdminModule,
    AppBootstrapModule,
    ChartsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    
    NgxBootstrapAlertNotificationModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmModalComponent]
})
export class AppModule {}
