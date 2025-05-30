import { Component } from "@angular/core";
import { AppRouteUrls } from "./shared/enums/app-route-urls.enum";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "yCare";
  readonly appRouteUrls = AppRouteUrls;
  /**
   * Function checks the current route is login route or not.
   * @return true if current route is login route.
   */

  constructor(private router: Router) {}

  isLoginRoute() {
    
    let urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams = {}; 
    let urlWithoutParams = urlTree.toString();
    return (
      this.router.url === this.appRouteUrls.ROUTE_SEPARATOR 
      || this.router.url === this.appRouteUrls.ROUTE_SEPARATOR + this.appRouteUrls.LOGIN
      || this.router.url === this.appRouteUrls.ROUTE_SEPARATOR + this.appRouteUrls.OTP_LOGIN
      || this.router.url === this.appRouteUrls.ROUTE_SEPARATOR + this.appRouteUrls.PATIENT_SIGNUP
      || this.router.url === this.appRouteUrls.ROUTE_SEPARATOR + this.appRouteUrls.FORGOT_PASSWORD
      || urlWithoutParams === this.appRouteUrls.ROUTE_SEPARATOR + this.appRouteUrls.USER_ACTION
      || urlWithoutParams === AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.MEDICAL_ADVICE
      || urlWithoutParams === AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.SECOND_OPINION
    );
  }

  /**
   * Loads or renders the sidebar menu when login is false
   */
  loadSidebarMenu() {
    return !this.isLoginRoute();
  }

  /**
   * Loads or renders the header menu when login is false
   */
  loadHeaderMenu() {
    return !this.isLoginRoute();
  }
}
