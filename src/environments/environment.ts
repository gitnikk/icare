// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  
  apiEndpoint: "http://localhost:",
  signinService: "8193",
  patientService: "9090",
  doctorService: "9091",
  caremanagerService: "9092",
  adminService: "9093",
  questionairService: "9095",
  sharedService: "9097",
  caseService: "9098",
  earningService: "9094",

  firebase: {
    apiKey: "YOURAPIKEY",
    projectId: "PROJECTID",    
  },
  emailVerification : true    //change it to false if you don't want to verify user using email activation link
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
