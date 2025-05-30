import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { mustMatch } from 'src/app/shared/custom.validator';
import { PatientService } from 'src/app/shared/services/patient.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-patient-signup',
  templateUrl: './patient-signup.component.html',
  styleUrls: ['./patient-signup.component.css']
})
export class PatientSignupComponent implements OnInit {
  signUpForm: FormGroup;
  isSubmitted  =  false;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  constructor(
    public router:Router, 
    private formBuilder:FormBuilder,
    private PatientService: PatientService,
    private AlertService: AlertService,
    private AuthService: AuthService
    ) { 
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: mustMatch('password', 'confirmPassword')
    });
  }

  /**
  * getter method
  */
  get signUpFormData() {
    return this.signUpForm.controls;
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
      case 'firstName':
        if (this.signUpFormData.firstName.errors && this.signUpFormData.firstName.errors.required) {
          return "First Name is required."
        }
        break;
        case 'lastName':
          if (this.signUpFormData.lastName.errors && this.signUpFormData.lastName.errors.required) {
            return "Last Name is required."
          }
        break;
        case 'mobileNumber':
          if (this.signUpFormData.mobileNumber.errors && this.signUpFormData.mobileNumber.errors.required) {
            return "Mobile number is required."
          }
          else if (this.signUpFormData.mobileNumber.errors && this.signUpFormData.mobileNumber.errors.pattern) {
            return "Mobile number is invalid."
          }
        break;
        case 'email':
          if (this.signUpFormData.email.errors && this.signUpFormData.email.errors.required) {
            return "Email address is required."
          }
          if (this.signUpFormData.email.errors && this.signUpFormData.email.errors.email) {
            return "Invalid email address."
          }
        break;

        case 'password':
          if (this.signUpFormData.password.errors && this.signUpFormData.password.errors.required) {
            return "Password required."
          }
        break;
        case 'confirmPassword':
          if (this.signUpFormData.confirmPassword.errors && this.signUpFormData.confirmPassword.errors.required) {
            return "Confirm password required."
          }
          if (this.signUpFormData.confirmPassword.errors && this.signUpFormData.confirmPassword.errors.mustMatch) {
            return "Password must match."
          }
        break;
      default:
        return 'Something went wrong!';
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.signUpForm.valid) {
      this.PatientService.patientSignUp(this.signUpForm.value).subscribe(
        (data: any) => {
          this.AuthService.SendVerificationMail(this.signUpFormData.email.value, this.signUpFormData.password.value);
          // this.AuthService.signIn(this.signUpFormData.email.value, this.signUpFormData.password.value);
        },
        (error: any) => {
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_SUCCESS, message: error});
          // console.log("error", error);
        }
      );
    }

  }
}
