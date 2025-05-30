import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { AppRouteUrls } from 'src/app/shared/enums/app-route-urls.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import firebase from '@firebase/app';
import '@firebase/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-otp-signin',
  templateUrl: './otp-signin.component.html',
  styleUrls: ['./otp-signin.component.css']
})
export class OtpSigninComponent implements OnInit {
  
  signInForm: FormGroup;
  isSubmitted  =  false;

  otpSent: boolean = false;
  inValidOtp: boolean = false;
  otp = null;
  recaptchaVerifier:any;
  mobNumberPattern = "^[0-9]{10}$";

  constructor(
      public router:Router,
      public AuthService: AuthService,
      public sessionService: SessionService,
      private spinner: NgxSpinnerService
    ) {
    this.signInForm = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required]),
      otp: new FormControl('')
    });
  }

  /**
  * getter method
  */
  get signInFormData() {
    return this.signInForm.controls;
  }

  /**
  * Slider Images and Carousel Control
  */
  sliderData = [
    { img: './assets/images/login/1.png', title: "Second Opinion Experts", description:"Get personalized, objective and secured medical advice from our US and India based specialists" }, 
    { img: './assets/images/login/2.png', title: "Virtual Clinic", description:"You can now seek a second opinion from any part of the world, right from the comfort of your home" },
    { img: './assets/images/login/3.png', title: "In-patient Services", description:"Benefit from our experience of helping International (foreign) patients find top quality, affordable medical care at India’s best healthcare centres" }
  ];
  CarouselOptions = { items: 1, dots: true, nav: false, autoplay:true, loop:true };  

  ngOnInit() {

    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    // firebase.initializeApp(environment.firebase);
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible'
    });
  }

  /**
   * to get error message
   * @param fieldName Field Name
   */
  getErrorMessage(fieldName) {
    switch (fieldName) {
      case 'mobileNumber':
        if (this.signInFormData.mobileNumber.errors && this.signInFormData.mobileNumber.errors.required) {
          return "Mobile number is required."
        }
        else if (this.signInFormData.mobileNumber.errors && this.signInFormData.mobileNumber.errors.pattern) {
          return "Mobile number is invalid."
        }
      break;
      
      default:
        return 'Something went wrong!';
    }
  }

  onSubmit(action) {
    this.isSubmitted = true;
    if(this.signInForm.valid) {
      this.spinner.show();
      if(action == "getOtp"){
        this.sendOtp();
      } else if ( action == 'verifyOtp') {
        this.signIn();
      }
      // this.AuthService.signIn(this.signInFormData.mobileNumber.value, this.signInFormData.otp.value);      
    }
  }


  showMobileField(){
    this.otpSent = false;
  }
  confirmationResult:any;
  sendOtp() {
    // console.log(this.myFormData.mobileNumber.value + "********"  + this.recaptchaVerifier);
    // return; 
    firebase.auth().signInWithPhoneNumber('+91' + this.signInFormData.mobileNumber.value, this.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult;
        this.otpSent = true;
        this.spinner.hide();
      }).catch(err => {
          console.log(err);
          this.spinner.hide();
      })
    }


    signIn() {
      // console.log (this.myFormData.otp.value.toString());
      this.confirmationResult.confirm(this.signInFormData.otp.value.toString()).then(user=>{
        // console.log("success: " + user);
        firebase.auth().currentUser.getIdToken(true).then(token => {
            localStorage.setItem('token', token);
            this.AuthService.getSignInUserInfo(token);
          });
        this.inValidOtp = false;
        this.spinner.hide();
      })
      .catch( error => {
        console.log("error: " + error);
        this.inValidOtp = true;
        this.spinner.hide();
      });
    }


}
