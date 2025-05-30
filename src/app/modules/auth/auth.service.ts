import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from './user';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { AppRouteUrls } from 'src/app/shared/enums/app-route-urls.enum';
import { ApiEndPoint } from 'src/app/shared/config/api-endpoint.config';

import { ApiRequestWrapperService } from "src/app/shared/services/common-services/api-request-wrapper.service";
import { AppApiUrls } from 'src/app/shared/enums/app-api-urls.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  modalRef: BsModalRef;

  userData: any; // Save logged in user data

  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;
  
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private sessionService: SessionService,

    private apiHandlerService: ApiRequestWrapperService,
    private AlertService : AlertService,
    private modalService: BsModalService,    
  ) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('signin');

    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    // this.afAuth.authState.subscribe(user => {
      // if (user) {
        // this.userData = user;
        // localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user'));

        // get claims
        // this.afAuth.auth.currentUser.getIdTokenResult(true).then(res => {
            // console.log("Claims",res.claims);
        // })
      // } else {
        // localStorage.setItem('user', null);
        // JSON.parse(localStorage.getItem('user'));
      // }
    // })

  }

  // The getAuth function simply returns the auth API that AngularFireAuth wraps
  getAuth() { 
    return this.afAuth.auth; 
  }
  /**
   * Firebase Sign in with email/password
   * @param email 
   * @param password 
   */
  signIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified !== true && environment.emailVerification == true) {
          // show popup message to activate user account via sending activation link to user's email
          this.modalRef = this.modalService.show(ConfirmModalComponent, {
            initialState: { 
              prompt: {
                title: 'Please activate your account.', 
                message: "To activate your account, please click on the account activation link in the mail which we sent to your registered email id and then attempt to login to your yCare account.",
                buttons: [{action: 'Close', class:'btn btn-light'}, {action: 'Resend Activation Link', class: 'btn btn-primary'}],
              },
              callback: (result) => {
                if (result == 'Resend Activation Link'){
                  return this.afAuth.auth.currentUser.sendEmailVerification()
                  .then(() => {
                    this.router.navigate(["/signin"]);
                    this.AlertService.showAlert({type:'success', title: "Activate your account !", message: "Activation link sent to your registered email address."});
                  }).catch((error) => {
                    this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: error.message});
                  });
                }
              }
            }
          });
        } else {
          this.afAuth.auth.currentUser.getIdToken(true).then(token => {
            localStorage.setItem('token', token);
            this.getSignInUserInfo(token);
          });
          // this.SetUserData(result.user);
          // console.log("SigninUser:",result);
          // localStorage.setItem('user', JSON.stringify(result));
        }        
      }).catch((error) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: error.message});
      });
  }





  /**
   * Send email activation link when new patient user sign up
   **/ 
  SendVerificationMail(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
      this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
        this.modalRef = this.modalService.show(ConfirmModalComponent, {
          initialState: { 
            prompt: {
              title: 'Activation link sent.', 
              message: "Thank you for registering your account with yCare! To activate your account, please click on the account activation link in the mail which we sent to your registered email id and then attempt to login to your yCare account.",
              buttons: [{action: 'Go to Login', class: 'btn btn-primary'}],
            },
            callback: (result) => { if(result == 'Go to Login'){ this.router.navigate(["/signin"]); } }
          }
        });
    }).catch((error) => {
      this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: error.message});
    });
    });
  }


  /**
   * Send password reset link to user's registered email Id
   * @param email 
   */
  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => console.log('Onboard Success!'))
      .catch((error) => console.log(error))
  }

  /**
   * Get Signin User's information
   * @param token 
   */
  getSignInUserInfo(token){
    const url = this.apiEndPoint + AppApiUrls.SIGN_IN_URL;
    this.apiHandlerService.get(url).subscribe(
      (data: any) => {
        this.sessionService.setIsUserLoggedIn("True");
        this.sessionService.setUserType(data.body.roles);
        this.sessionService.setProfileId(data.body.userId);
        this.sessionService.setProfileName(data.body.name);
        this.sessionService.setUID(data.body.uid);

        // show success message
        this.AlertService.showAlert({type:'success', title: "Login " + AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.LOGIN_SUCCESS});

        this.redirectionAfterLogin();
      },
      (error: any) => {
        // show error message
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});

        // console.log("error", error);
      }
    );   
    
  }

  /**
   * Redirect to portal after user logged in successfully
   */
  redirectionAfterLogin(){
    if(this.sessionService.isUserAdmin()){
      this.router.navigate([AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.ADMIN_DASHBOARD]);    
    }
    else if(this.sessionService.isUserCM()){
      this.router.navigate([AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGER_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.CARE_MANAGER_DASHBOARD]);
    }
    else if(this.sessionService.isUserDoctor()){
      this.router.navigate([AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.DOCTOR_DASHBOARD]);
    }
    else if(this.sessionService.isUserPatient())
    {
      this.router.navigate([AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_MODULE + AppRouteUrls.ROUTE_SEPARATOR + AppRouteUrls.PATIENT_DASHBOARD]);
    }
  }

  /**
   *  SignOut method for logging out from the Angular/Firebase app
   **/
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      localStorage.clear();
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  // SetUserData(user) {
  //   // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  //   const userData: User = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //     emailVerified: user.emailVerified
  //   }
  //   // return userRef.set(userData, {
  //   //   merge: true
  //   // })
  // }

  

  changeFirebasePassword(formData){
    const url = this.apiEndPoint + AppApiUrls.CHANGE_PASS_URL;
    return this.apiHandlerService.save(url, formData);
  }
}
