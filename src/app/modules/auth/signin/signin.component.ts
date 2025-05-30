import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { AppRouteUrls } from 'src/app/shared/enums/app-route-urls.enum';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  
  signInForm: FormGroup;
  isSubmitted  =  false;

  constructor(
      public router:Router,
      public AuthService: AuthService,
      public sessionService: SessionService
    ) {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
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
  }

  /**
   * to get error message
   * @param fieldName Field Name
   */
  getErrorMessage(fieldName) {
    switch (fieldName) {
      case 'email':
        if (this.signInFormData.email.errors && this.signInFormData.email.errors.required) {
          return "Email address is required."
        }
        if (this.signInFormData.email.errors && this.signInFormData.email.errors.email) {
         return "Invalid email address."
        }
        break;
      case 'password':
        if (this.signInFormData.password.errors && this.signInFormData.password.errors.required) {
          return "Password required."
        }
        break;
      default:
        return 'Something went wrong!';
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.signInForm.valid) {
      this.AuthService.signIn(this.signInFormData.email.value, this.signInFormData.password.value);      
    }
  }



}
