import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  isSubmitted  =  false;

  constructor(public router:Router,
    public AuthService: AuthService,
    public AlertService: AlertService,

    ) {
      this.forgotPassForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
      });
     }

/**
  * getter method
  */
 get forgotPassFormData() {
  return this.forgotPassForm.controls;
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
}

/**
 * to get error message
 * @param fieldName Field Name
 */
getErrorMessage(fieldName) {
  switch (fieldName) {
    case 'email':
      if (this.forgotPassFormData.email.errors && this.forgotPassFormData.email.errors.required) {
        return "Email address is required."
      }
      if (this.forgotPassFormData.email.errors && this.forgotPassFormData.email.errors.email) {
       return "Invalid email address."
      }
      break;
    default:
      return 'Something went wrong!';
  }
}

onSubmit() {
  this.isSubmitted = true;
  if(this.forgotPassForm.valid) {
    this.AuthService.getAuth().sendPasswordResetEmail(this.forgotPassFormData.email.value)
    .then(resp => {
     this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: "We have sent you password reset link to your registered email address."});
    }).catch(e => {
      this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: e});
    });
  }
}
}


  

  
