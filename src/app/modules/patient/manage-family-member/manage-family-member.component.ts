import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-manage-family-member',
  templateUrl: './manage-family-member.component.html',
  styleUrls: ['./manage-family-member.component.css']
})
export class ManageFamilyMemberComponent implements OnInit {
  memberForm: FormGroup;
  isSubmitted:boolean = false;
  mobNumberPattern = "^[0-9]{10}$";
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private AlertService: AlertService,
    public formBuilder: FormBuilder, 
    private PatientService: PatientService, 
  ) {
    this.buildFormGroup();
  }

  patientUserId:string = "";
  memberId:string = "";
  editForm:boolean = false;
  ngOnInit() {
    this.patientUserId = this.sessionService.getProfileId();
    // check for edit form
    this.route.params.subscribe(params => {
      if(params['id']){
        this.editForm = true;
        this.memberId = params['id'];
        this.getFamilyMemberDetails();
      }
    });
    
  }

  /**
   * Form builder setup
   */
  buildFormGroup(){
    /**
     * Form entities
     */
    this.memberForm = this.formBuilder.group({
      firstName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      contactNumber: new FormControl("", [Validators.required]),
      street1: new FormControl("", [Validators.required, Validators.maxLength(500) ]),   
      street2: new FormControl("", [Validators.maxLength(500) ]),   
      city: new FormControl("", [Validators.required]),   
      state: new FormControl("", [Validators.required]),   
      postalCode: new FormControl("", [Validators.required]),   
      country: new FormControl("", [Validators.required]),
      dob: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
      weight: new FormControl("", [Validators.required]),
      height: new FormControl("", [Validators.required]),
      nationality: new FormControl("", [Validators.required]),
      occupation: new FormControl("", [Validators.required]),
    });
  }

  /**
   * getter method for profile form data
   */
  get memberFormData() {
    return this.memberForm.controls;
  }

  /**
   * Get Details of patient
   */
  getFamilyMemberDetails(){
    this.PatientService.getFamilyMemberDetails(this.memberId).subscribe(
      (data: any) => {
        this.bindFormValues({patientEntity: data.body});
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }

  bindFormValues(data){
    console.log(data);
    
    this.memberForm.patchValue({
      firstName: data.patientEntity.firstName,
      lastName: data.patientEntity.lastName,
      email: data.patientEntity.email,
      contactNumber: data.patientEntity.contactNumber,
      street1: (data.patientEntity.address && data.patientEntity.address.street1) ? data.patientEntity.address.street1 : "",   
      street2: (data.patientEntity.address && data.patientEntity.address.street2) ? data.patientEntity.address.street2 : "",   
      city: (data.patientEntity.address && data.patientEntity.address.city) ? data.patientEntity.address.city : "",   
      state: (data.patientEntity.address && data.patientEntity.address.state) ? data.patientEntity.address.state : "",   
      postalCode: (data.patientEntity.address && data.patientEntity.address.postalCode) ? data.patientEntity.address.postalCode : "",   
      country: (data.patientEntity.address && data.patientEntity.address.country) ? data.patientEntity.address.country : "",
      dob: data.patientEntity.dob,
      gender: data.patientEntity.gender,
      weight: data.patientEntity.weight,
      height: data.patientEntity.height,
      nationality: data.patientEntity.nationality,
      occupation: data.patientEntity.occupation
    });
  }

  /**
  * Return Validation Error Message
  */
  getErrorMessage(fieldName) {
    switch (fieldName) {
      // Profile form Validation messages
      case 'firstName':
        if (this.memberFormData.firstName.errors && this.memberFormData.firstName.errors.required) {
          return "First Name is required."
        }
        else if (this.memberFormData.firstName.errors && this.memberFormData.firstName.errors.maxlength) {
          return "Maximum of 25 characters."
        }
      break;
      
      case 'lastName':
        if (this.memberFormData.lastName.errors && this.memberFormData.lastName.errors.required) {
          return "Last Name is required."
        }
        else if (this.memberFormData.lastName.errors && this.memberFormData.lastName.errors.maxlength) {
          return "Maximum of 25 characters."
        }
      break;

      case 'email':
        if (this.memberFormData.email.errors && this.memberFormData.email.errors.required) {
          return "Email address is required."
        }
        if (this.memberFormData.email.errors && this.memberFormData.email.errors.email) {
          return "Invalid email address."
        }
      break;
      case 'gender':
        if (this.memberFormData.gender.errors && this.memberFormData.gender.errors.required) {
          return "Gender is required."
        }
      break;
      
      case 'weight':
        if (this.memberFormData.weight.errors && this.memberFormData.weight.errors.required) { return "Weight is required" }
      break;
      
      case 'height':
        if (this.memberFormData.height.errors && this.memberFormData.height.errors.required) { return "Height is required" }
      break;

      case 'street1':
        if (this.memberFormData.street1.errors && this.memberFormData.street1.errors.required) {
          return "Address Line is required."
        }
        else if (this.memberFormData.street1.errors && this.memberFormData.street1.errors.maxlength) {
          return "Maximum of 500 characters."
        }
      break;
      
      case 'street2':
        if (this.memberFormData.street2.errors && this.memberFormData.street2.errors.maxlength) {
          return "Maximum of 500 characters."
        }
      break;
      
      case 'city':
        if (this.memberFormData.city.errors && this.memberFormData.city.errors.required) {
          return "City is required."
        }
      break;

      case 'state':
        if (this.memberFormData.state.errors && this.memberFormData.state.errors.required) {
          return "State is required."
        }
      break;

      case 'country':
        if (this.memberFormData.country.errors && this.memberFormData.country.errors.required) {
          return "Country is required."
        }
      break;

      case 'postalCode':
        if (this.memberFormData.postalCode.errors && this.memberFormData.postalCode.errors.required) {
          return "Pincode is required."
        }
      break;

      case 'nationality':
        if (this.memberFormData.nationality.errors && this.memberFormData.nationality.errors.required) {
          return "Nationality is required."
        }
      break;

      case 'occupation':
        if (this.memberFormData.occupation.errors && this.memberFormData.occupation.errors.required) {
          return "Occupation is required."
        }
      break;
      
      case 'dob':
        if (this.memberFormData.dob.errors && this.memberFormData.dob.errors.required) {
          return "Date of birth is required."
        }
      break;

      case 'contactNumber':
        if (this.memberFormData.contactNumber.errors && this.memberFormData.contactNumber.errors.required) {
          return "Contact number is required."
        }
        else if (this.memberFormData.contactNumber.errors && this.memberFormData.contactNumber.errors.pattern) {
          return "Contact number is invalid."
        }
      break;
  
      default:
        return 'Something went wrong!';
    }
  }


  /**
   * submit form action
   */
  onSubmit(){
    this.isSubmitted = true;
    if(this.memberForm.valid) {
      // Call Add api
      if(!this.editForm){
        let formData = this.setApiRequest();
        this.PatientService.addFamilyMember(this.patientUserId, formData).subscribe(
          (data: any) => {
            this.router.navigate(["/patient/family-members"]);
            this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.UPDATE_SUCCESS});
          },
          (error: any) => {
            // console.log("error", error);
            this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
          }
        );
      } else {
        let formData = this.setApiRequest();
        this.PatientService.updateFamilyMember(this.memberId, formData).subscribe(
          (data: any) => {
            this.router.navigate(["/patient/family-members"]);
            this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.UPDATE_SUCCESS});
          },
          (error: any) => {
            // console.log("error", error);
            this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
          }
        );
      }
    }  
  }

  /**
   * Configure the request body for update profile api 
   */
  setApiRequest(){

    return {
              "firstName": this.memberFormData.firstName.value,
              "lastName": this.memberFormData.lastName.value,
              "email": this.memberFormData.email.value,
              "contactNumber": this.memberFormData.contactNumber.value,
              "address": {
                  "street1": this.memberFormData.street1.value,
                  "street2": this.memberFormData.street2.value,
                  "city": this.memberFormData.city.value,
                  "state": this.memberFormData.state.value,
                  "postalCode": this.memberFormData.postalCode.value,
                  "country": this.memberFormData.country.value
              },
              "gender": this.memberFormData.gender.value,
              "weight": this.memberFormData.weight.value,
              "height": this.memberFormData.height.value,
              "nationality": this.memberFormData.nationality.value,
              "occupation": this.memberFormData.occupation.value,
              "dob": this.memberFormData.dob.value,
              
             }

  }





}


