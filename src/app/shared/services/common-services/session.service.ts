import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppRouteUrls } from "../../enums/app-route-urls.enum";
import { AppLocalstorage } from "../../enums/app-localstorage.enum";
import { AppUserRoles } from "../../enums/app-user-roles.enum";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  readonly appRouteUrls = AppRouteUrls;
  readonly appLocalstorage = AppLocalstorage;
  readonly appUserRoles = AppUserRoles;

  private loggedIn = false;
  private adminRole = false;
  private doctorRole = false;
  private patientRole = false;
  private cmRole = false;

  constructor(private router: Router) {}

  /**
   * Sets user login status
   * @param isLoggedIn User logged in status in String Ex. True
   */
  setIsUserLoggedIn(isUserLoggedIn: string) {
    localStorage.setItem(
      this.appLocalstorage.IS_USER_LOGGED_IN,
      isUserLoggedIn
    );
  }

  /**
   * Get user login
   */
  getIsUserLoggedIn() {
    return localStorage.getItem(this.appLocalstorage.IS_USER_LOGGED_IN);
  }

  /**
   * Checks if user is logged in
   */
  isLoggedIn() {
    this.loggedIn = this.getIsUserLoggedIn() === "True" ? true : false;
    return this.loggedIn;
  }

  /**
   * Set User type in localStorage
   * @param userType The user type Ex. Admin/patient/doctor/cm
   */
  setUserType(userType: string) {
    localStorage.setItem(this.appLocalstorage.USER_TYPE, userType);
  }
  
  /**
   * Get logged In user Type
   */
  getUserType() {
    return localStorage.getItem(this.appLocalstorage.USER_TYPE);
  }
  
  /**
   * Set Profile Id in localStorage
   * @param profileId The profileId Ex. PATU00001
   */
  setProfileId(profileId: string) {
    localStorage.setItem(this.appLocalstorage.USER_PROFILE_ID, profileId);
  }

  /**
   * Get Logged in Profile Id
   */
  getProfileId() {
    return localStorage.getItem(this.appLocalstorage.USER_PROFILE_ID);
  }

  /**
   * Set Profile Name in localStorage
   * @param profileName
   */
  setProfileName(profileName: string) {
    localStorage.setItem(this.appLocalstorage.USER_PROFILE_NAME, profileName);
  }

  /**
   * Get Profile Name 
   */
  getProfileName() {
    return localStorage.getItem(this.appLocalstorage.USER_PROFILE_NAME);
  }

  /**
   * Set Firebase user id in localStorage
   * @param uid
   */
  setUID(uid: string) {
    localStorage.setItem(this.appLocalstorage.FIREBASE_USER_ID, uid);
  }

  /**
   * Get Firebase user id
   */
  getUID() {
    return localStorage.getItem(this.appLocalstorage.FIREBASE_USER_ID);
  }

  

  /**
   * [Checks if user is admin.]
   */
  isUserAdmin() {
    this.doctorRole = false;
    this.cmRole = false;
    this.patientRole = false;
    this.adminRole =
      this.getUserType() === this.appUserRoles.ADMIN ? true : false;
    return this.adminRole;
  }

  /**
   * Checks if user is doctor
   */
  isUserDoctor() {
    this.adminRole = false;
    this.cmRole = false;
    this.patientRole = false;
    this.doctorRole =
      this.getUserType() === this.appUserRoles.DOCTOR ? true : false;
    return this.doctorRole;
  }

  /**
   * Checks if user is patient
   */
  isUserPatient() {
    this.adminRole = false;
    this.doctorRole = false;
    this.cmRole = false;
    this.patientRole =
      this.getUserType() === this.appUserRoles.PATIENT ? true : false;
    return this.patientRole;
  }

  /**
   * Checks if user is care manager
   */
  isUserCM() {
    this.adminRole = false;
    this.doctorRole = false;
    this.patientRole = false;
    this.cmRole =
      this.getUserType() === this.appUserRoles.CARE_MANEGER ? true : false;
    return this.cmRole;
  }

  /**
   * Create session for current logged in user
   */
  setContext(data: any) {
    this.loggedIn = true;
    const userLoggedIn = "True";
    this.setIsUserLoggedIn(userLoggedIn);
    this.setUserType(data.type);
  }

  /**
   * [Reset session of current logged in user.]
   */
  resetSession() {
    this.loggedIn = false;
    localStorage.removeItem(this.appLocalstorage.IS_USER_LOGGED_IN);
    localStorage.removeItem(this.appLocalstorage.USER_TYPE);
  }
}
