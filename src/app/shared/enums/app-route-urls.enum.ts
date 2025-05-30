export enum AppRouteUrls {
  ROUTE_PARENT = ".",
  ROUTE_SEPARATOR = "/",

  // Modules Route
  ADMIN_MODULE = "admin",
  CARE_MANAGER_MODULE = "caremanager",
  DOCTOR_MODULE = "doctor",
  PATIENT_MODULE = "patient",

  // basic routes
  OTP_LOGIN = "otp-signin",
  LOGIN = "signin",
  USER_ACTION = "user-action",
  FORGOT_PASSWORD = "forgot-password",
  CHANGE_PASSWORD = "change-password",
  
  // admin urls
  ADMIN_DASHBOARD = "dashboard",
  DOCTORS_LIST = "doctors",
  CARE_MANAGERS_LIST = "caremanagers",
  ONBOARD_DOCTOR = "onboard-doctor",
  ONBOARD_CARE_MANAGER = "onboard-caremanager",
  CASE_LIST = "cases",
  CASE_ALLOCATION = "case-allocation",
  EARNING_MANAGEMENT = "earning-management",

  // patient urls
  PATIENT_DASHBOARD = "home",
  PATIENT_SIGNUP = "patient-signup",
  CREATE_CASE = "create-case",
  MY_PROFILE = "my-profile",
  FAMILY_MEMBER_LIST = "family-members",
  FAMILY_MEMBER_FORM = "member-form",
  MEDICAL_ADVICE = "iservice/medical-advice",
  SECOND_OPINION = "iservice/second-opinion",

  // care manager urls
  CARE_MANAGER_DASHBOARD = "home",
  CASE_DETAILS = "case-details",
  CM_PROFILE = "cm-profile",
  CM_EDIT = "cm-edit",
  
  // doctor urls
  DOCTOR_DASHBOARD = "home",
  DOCTOR_PROFILE = "doctor-profile",
  DOCTOR_EDIT = "doctor-edit",
  
}
