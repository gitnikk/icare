import { Injectable } from "@angular/core";
import {
  CanLoad,
  CanActivate,
  Route,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment,
} from "@angular/router";
import { Observable, from } from "rxjs";
import { SessionService } from "./shared/services/common-services/session.service";
import { RoutingService } from "./shared/services/common-services/routing.service";
import { AppRouteUrls } from "./shared/enums/app-route-urls.enum";

@Injectable({
  providedIn: "root",
})
export class AppAuthGuardGuard implements CanLoad, CanActivate {
  public restrictedUrls: any = {
    "/login": true,
    "/patient/iservice/medical-advice": true,
    "/patient/iservice/second-opinion": true,
  };
  constructor(
    private sessionService: SessionService,
    private routingService: RoutingService,
    private router: Router
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = route.path;

    return false;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const stateUrl: string = state.url;
    if (
      !this.sessionService.isLoggedIn() &&
      this.restrictNavigation(stateUrl)
    ) {
      return true;
    } else if(
      this.sessionService.isLoggedIn() && 
      (state.url == AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.MEDICAL_ADVICE 
      || state.url == AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.SECOND_OPINION)
    ) {
        // yCare Service Landing page forms
        return true;
    } 
    else if (
      this.sessionService.isLoggedIn() &&
      (state.url !== AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.LOGIN ||
        state.url !== AppRouteUrls.ROUTE_SEPARATOR)
    ) {
      // check if user role is admin and check urls
      if (this.sessionService.isUserAdmin()) {
        if (this.checkIsValidAdminUrl(stateUrl)) {
          return true;
        }
      }
      // check if user role is doctor and check urls
      else if (this.sessionService.isUserDoctor()) {
        if (this.checkIsValidDoctorUrl(stateUrl)) {
          return true;
        }
      }

      // check if user role is care manager and check urls
      else if (this.sessionService.isUserCM()) {
        if (this.checkIsValidCMUrl(stateUrl)) {
          return true;
        }
      }

      // check if user role is patient and check urls
      else if (this.sessionService.isUserPatient()) {
        if (this.checkIsValidPatientUrl(stateUrl)) {
          return true;
        }
      }
    } else if (
      this.sessionService.isLoggedIn() &&
      (state.url === AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.LOGIN ||
        state.url === AppRouteUrls.ROUTE_SEPARATOR) &&
      (this.sessionService.isUserDoctor() || this.sessionService.isUserAdmin())
    ) {
      this.router.navigate(["**"]);
      return false;
    }
    
    if(state.url == AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_DASHBOARD) {
      this.router.navigate([this.routingService.navigateToOTPLogin()]);  
    }
    // If router doesn't match to any
    this.router.navigate([this.routingService.navigateToLogin()]);
    return false;
    
  }

  checkIsValidAdminUrl(stateUrl) {
    switch (stateUrl) {
      // Dashboard URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_DASHBOARD:
        return true;
      
        // Case List URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CASE_LIST:
        return true;
      
        // Caremanager List URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGERS_LIST:
        return true;
      
        // Caremanager Onboard URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ONBOARD_CARE_MANAGER:
        return true;
      
        // Caremanager Edit page URL
      // case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CM_EDIT+"/CM000026":
        // return true;
      
        // Doctors List URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTORS_LIST:
        return true;
      
        // Doctors Onboard URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ONBOARD_DOCTOR:
        return true;
      
      // Admin Profile URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.MY_PROFILE:
        return true;
          
      // Earning Mangement URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.EARNING_MANAGEMENT:
        return true;
          

      default:
        return false;
    }
  }

  checkIsValidDoctorUrl(stateUrl) {
    switch (stateUrl) {
      // Dashboard URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_DASHBOARD:
        return true;
      // Caselist URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CASE_LIST:
        return true;  

      // // Case Details URL
      // case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CASE_DETAILS + "/CASE000023":
      //   return true;
      
      // Profile Page URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_PROFILE:
        return true;
        
      default:
        return false;
    }
  }

  checkIsValidCMUrl(stateUrl) {
    switch (stateUrl) {
      // Dashboard URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGER_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGER_DASHBOARD:
        return true;
          
      // Caselist URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGER_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CASE_LIST:
        return true;

      // // Case Details URL
      // case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGER_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CASE_DETAILS + "/CASE000023":
      //   return true;

      // Profile page URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGER_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CM_PROFILE:
        return true;
          
      default:
        return false;
    }
  }

  checkIsValidPatientUrl(stateUrl) {
    switch (stateUrl) {
      // Patient Dashboard URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_DASHBOARD:
        return true;
      // Patient Case List URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CASE_LIST:
        return true;
      // Create Case URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CREATE_CASE:
        return true;

      // View/Edit Profile URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.MY_PROFILE:
        return true;

      // Family Member list URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.FAMILY_MEMBER_LIST:
        return true;

      // Family Member form URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.FAMILY_MEMBER_FORM:
        return true;

      // case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.FAMILY_MEMBER_FORM + "/PAT000012":
      //   return true;
          
      // Case Details URL
      case AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CASE_DETAILS + "/CASE000042":
        return true;

      default:
        return false;
    }
  }

  // Controls restriction's of url
  restrictNavigation(url: any) {
    if (this.restrictedUrls[url]) {
      return true;
    }
    return false;
  }
}
