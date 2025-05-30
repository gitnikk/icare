/**
 * This component is used to create below yCare service cases
 *    1) Medical Advice
 *    2) Second Opinion
 */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import firebase from '@firebase/app';
import '@firebase/auth';
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaseService } from 'src/app/shared/services/case.service';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-inhouse-service',
  templateUrl: './inhouse-service.component.html',
  styleUrls: ['./inhouse-service.component.css']
})
export class InhouseServiceComponent implements OnInit {

  // OTP
  otpSent: boolean = false;
  inValidOtp: boolean = false;
  otp = null;
  recaptchaVerifier:any;

  serviceType:string;
  serviceTitle:string;
  myForm: FormGroup;
  isSubmitted:boolean = false;
  mobNumberPattern = "^[0-9]{10}$";
  
  modalRef: BsModalRef;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private AlertService: AlertService,
    public formBuilder: FormBuilder, 
    private CaseService: CaseService,
    private SharedApiService: SharedApiService, 
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
  ) {
    this.buildFormGroup();
  }

  /**
   * Form builder setup
   */
  buildFormGroup(){
    this.myForm = this.formBuilder.group({
      firstName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      email: new FormControl("", [Validators.email]),
      mobileNumber: new FormControl("", [Validators.required]),
      note: new FormControl("", [ Validators.maxLength(500) ]),   
      city: new FormControl("", []),   
      doctorPanel: new FormControl("Indian Panel", [Validators.required]),   
      state: new FormControl("", []),   
      dob: new FormControl("", [Validators.required]),
      serviceCategory: new FormControl(""),
      otp: new FormControl(""),
    });
  }


  
  ngOnInit() {
    // initialise the firebase app
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    
    // get list of categories to display in speciality dropdown
    this.getServiceCategories();

    // invisible recaptcha
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    'size': 'invisible'
    });

    // set the service type and title on the basis of url
    if(this.router.url == "/patient/iservice/medical-advice"){
      this.serviceType = "Medical-Advice";
      this.serviceTitle = "Medical Advice";
    } else if(this.router.url == "/patient/iservice/second-opinion"){
      this.serviceType = "Second-Opinion";
      this.serviceTitle = "Second Opinion";
    }
  }


  /**
   * Get Service Category and Sub Category list
   */
  public categories:any;
  getServiceCategories(){
    this.SharedApiService.getServiceCategory().subscribe(
      (data: any) => {
        this.categories = data.body.content; 
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }
  

  /**
   * submit form action
   */
  onSubmit(action){
    this.isSubmitted = true;
    if(this.myForm.valid) {
      this.spinner.show();
      if(action == "getOtp"){
        this.sendOtp();
      } else if ( action == 'verifyOtp') {
        this.verifyOtp();
      }
      
      
      
    }  
  }

  uid:string;
  confirmationResult:any;
  sendOtp() {
    firebase.auth().signInWithPhoneNumber('+91' + this.myFormData.mobileNumber.value, this.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult;
        this.otpSent = true;
        this.spinner.hide();
      }).catch(err => {
        console.log(err);
        this.spinner.hide();
    });
  }


  verifyOtp() {
    // console.log (this.myFormData.otp.value.toString());
    this.confirmationResult.confirm(this.myFormData.otp.value.toString()).then(userData=>{
      this.uid = userData.user.uid;
      // console.log("success: " + JSON.stringify(userData));
      this.inValidOtp = false;
      this.spinner.hide();
      if(this.serviceType == "Medical-Advice"){
        this.addMedicalAdvice();
      } else if(this.serviceType == "Second-Opinion"){
        this.addSecondOpinion();
      }
      
      
    })
    .catch( error => {
      console.log("error: " + error);
      this.inValidOtp = true;
      this.spinner.hide();
    });
  }

  addMedicalAdvice(){
    // Call Add api
    let data = this.setApiRequest("medicalAdvice");
    this.CaseService.addMedicalAdvice(data).subscribe(
      (data: any) => {

        this.showSuccessPopupMessage();
        // this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }

  addSecondOpinion(){
    // Call Add api
    let data = this.setApiRequest("secondOpinion");
    this.CaseService.addSecondOpinion(data).subscribe(
      (data: any) => {
        this.showSuccessPopupMessage();
        // this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }

  showSuccessPopupMessage() {
    this.otpSent = false;
    // show popup message to activate user account via sending activation link to user's email
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: { 
        prompt: {
          title: 'Thank you.', 
          message: "Your request sent successfully, our Care Manager will call you for the further details.",
          buttons: [{action: 'Done', class: 'btn btn-primary'}],
        },
        callback: (result) => {
          if (result == 'Done'){
            
          }
        }
      }
    });
  }  

  




  /**
   * getter method for profile form data
   */
  get myFormData() {
    return this.myForm.controls;
  }

  /**
  * Return Validation Error Message
  */
  getErrorMessage(fieldName) {
    switch (fieldName) {
      // Profile form Validation messages
      case 'firstName':
        if (this.myFormData.firstName.errors && this.myFormData.firstName.errors.required) {
          return "First Name is required."
        }
        else if (this.myFormData.firstName.errors && this.myFormData.firstName.errors.maxlength) {
          return "Maximum of 25 characters."
        }
      break;
      
      case 'lastName':
        if (this.myFormData.lastName.errors && this.myFormData.lastName.errors.required) {
          return "Last Name is required."
        }
        else if (this.myFormData.lastName.errors && this.myFormData.lastName.errors.maxlength) {
          return "Maximum of 25 characters."
        }
      break;

      case 'email':
        if (this.myFormData.email.errors && this.myFormData.email.errors.required) {
          return "Email address is required."
        }
        if (this.myFormData.email.errors && this.myFormData.email.errors.email) {
          return "Invalid email address."
        }
      break;
      
      case 'doctorPanel':
        if (this.myFormData.doctorPanel.errors && this.myFormData.doctorPanel.errors.required) {
          return "Choose doctor's panel."
        }
      break;
      case 'serviceCategory':
        if (this.myFormData.serviceCategory.errors && this.myFormData.serviceCategory.errors.required) {
          return "Speciality is required."
        }
      break;
      
      case 'city':
        if (this.myFormData.city.errors && this.myFormData.city.errors.required) {
          return "City is required."
        }
      break;

      case 'state':
        if (this.myFormData.state.errors && this.myFormData.state.errors.required) {
          return "State is required."
        }
      break;

      

      case 'dob':
        if (this.myFormData.dob.errors && this.myFormData.dob.errors.required) {
          return "Date of birth is required."
        }
      break;

      case 'mobileNumber':
        if (this.myFormData.mobileNumber.errors && this.myFormData.mobileNumber.errors.required) {
          return "Mobile number is required."
        }
        else if (this.myFormData.mobileNumber.errors && this.myFormData.mobileNumber.errors.pattern) {
          return "Mobile number is invalid."
        }
      break;
  
      default:
        return 'Something went wrong!';
    }
  }

  base64textString:any;
  uploadFileArr = [];
  onFilesChanged(event){
    // console.log(event.target.files);
    for (let index = 0; index < event.target.files.length; index++)
    {
      const file = event.target.files[index];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e:any) => {
        var binaryString = e.target.result;
        this.base64textString= btoa(binaryString);
        this.uploadFileArr.push({ name: file.name, content: this.base64textString});
  
      };
    }
  }
  
  
  /**
   * Configure the request body for update profile api 
   */
    setApiRequest(service){
    if(service == "medicalAdvice"){
      return {
        "uid": this.uid,
        "firstName": this.myFormData.firstName.value,
        "lastName": this.myFormData.lastName.value,
        "email": this.myFormData.email.value,
        "mobileNumber": this.myFormData.mobileNumber.value,
        "city": this.myFormData.city.value,
        "state": this.myFormData.state.value,
        "note": this.myFormData.note.value,
        "specialty": this.myFormData.serviceCategory.value,
        "dob": this.myFormData.dob.value, 
        "serviceType": this.serviceType        
       
      }
    }
    else if (service == "secondOpinion"){
      return {
        "uid": this.uid,
        "firstName": this.myFormData.firstName.value,
        "lastName": this.myFormData.lastName.value,
        "email": this.myFormData.email.value,
        "mobileNumber": this.myFormData.mobileNumber.value,
        "city": this.myFormData.city.value,
        "state": this.myFormData.state.value,
        "note": this.myFormData.note.value,
        "specialty": this.myFormData.serviceCategory.value,
        "dob": this.myFormData.dob.value, 
        "doctorPanel": this.myFormData.doctorPanel.value, 
        "serviceType": this.serviceType,
        "medicalReports": this.uploadFileArr
      }
    }
  }





}


