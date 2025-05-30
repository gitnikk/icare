import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppRouteUrls } from "../../enums/app-route-urls.enum";

@Injectable({
  providedIn: "root",
})
export class RoutingService {
  readonly appRouteUrls = AppRouteUrls;

  constructor(private router: Router) {}

  /**
   * Function checks the current route is login route or not.
   * @return true if current route is login route.
   */
  isLoginRoute() {
    return (
      this.router.url ===
        this.appRouteUrls.ROUTE_PARENT + this.appRouteUrls.ROUTE_SEPARATOR ||
      this.router.url ===
        this.appRouteUrls.ROUTE_PARENT +
          this.appRouteUrls.ROUTE_SEPARATOR +
          this.appRouteUrls.LOGIN
    );
  }

  /**
   * Navogate to application login page
   */
  navigateToLogin() {
    this.router.navigate([
      this.appRouteUrls.ROUTE_SEPARATOR + this.appRouteUrls.LOGIN,
    ]);
  }

  /**
   * Navogate to patient otp login page
   */
  navigateToOTPLogin() {
    this.router.navigate([
      this.appRouteUrls.ROUTE_SEPARATOR + this.appRouteUrls.OTP_LOGIN,
    ]);
  }

  /**
   * Navigate to admin dashboard
   */
  navigateToAdminDashboard() {
    this.router.navigate([
      this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.ADMIN_MODULE +
        this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.ADMIN_DASHBOARD,
    ]);
  }

  /**
   * Navigate to doctor dashboard
   */
  navigateToDoctorDashboard() {
    this.router.navigate([
      this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.DOCTOR_MODULE +
        this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.DOCTOR_DASHBOARD,
    ]);
  }

  /**
   * Navigate to patient dashboard
   */
  navigateToPatientDashboard() {
    this.router.navigate([
      this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.PATIENT_MODULE +
        this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.PATIENT_DASHBOARD,
    ]);
  }

  /**
   * Navigate to care manager dashboard
   */
  navigateToCMDashboard() {
    this.router.navigate([
      this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.CARE_MANAGER_MODULE +
        this.appRouteUrls.ROUTE_SEPARATOR +
        this.appRouteUrls.CARE_MANAGER_DASHBOARD,
    ]);
  }
}
