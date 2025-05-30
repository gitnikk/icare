import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl, } from "@angular/forms";
import { CareManagerService } from "../../../shared/services/caremanager.service";
import { Router } from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';

@Component({
  selector: "app-onboard-care-manager",
  templateUrl: "./onboard-care-manager.component.html",
  styleUrls: ["./onboard-care-manager.component.css"],
})

export class OnboardCareManagerComponent implements OnInit {
  
  public onBoardCMForm: FormGroup;
  public workForm: FormGroup;
  isSubmitted  =  false;
  mobNumberPattern = "^[0-9]{10}$";
  
  constructor(
    private AlertService: AlertService,
    private formBuilder: FormBuilder,
    private careManagerService: CareManagerService,
    private router: Router,
    private AuthService: AuthService,
    private SharedApiService: SharedApiService
  ) {}

  ngOnInit() {
    this.buildFormGroup();
    this.getServiceCategories();
  }

  buildFormGroup() {
    this.onBoardCMForm = this.formBuilder.group({
      firstName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      gender: new FormControl("", [Validators.required]),
      dob: new FormControl(null, [Validators.required]),
      contactNumber: new FormControl("", [Validators.required]),
      emailId: new FormControl("", [Validators.required, Validators.email]),
      street1: new FormControl("", [Validators.required, Validators.maxLength(500)]),
      street2: new FormControl("", [Validators.maxLength(500)]),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      postalCode: new FormControl("", [Validators.required]),
    });

    this.workForm = this.formBuilder.group({
      category: new FormControl("", [Validators.required]),
      subcategory: new FormControl("", [Validators.required]),
      workexperience: new FormControl(""),
      skillset: new FormControl(""),
    });
  }

  /**
   * getter method for cm details form
   */
  get onBoardCMFormData() {
    return this.onBoardCMForm.controls;
  }

  /**
   * getter method for work experience form
   */
  get workFormData() {
    return this.workForm.controls;
  }


  /**
   * to get error message
   * @param fieldName Field Name
   */
  getErrorMessage(fieldName) {
    switch (fieldName) {
        case 'firstName':
          if (this.onBoardCMFormData.firstName.errors && this.onBoardCMFormData.firstName.errors.required) {
            return "First Name is required."
          }
          else if (this.onBoardCMFormData.firstName.errors && this.onBoardCMFormData.firstName.errors.maxlength) {
            return "Maximum of 25 characters."
          }
          else if (this.onBoardCMFormData.firstName.errors && this.onBoardCMFormData.firstName.errors.pattern) {
            return "No special characters are allowed."
          }
        break;
        case 'lastName':
          if (this.onBoardCMFormData.lastName.errors && this.onBoardCMFormData.lastName.errors.required) {
            return "Last Name is required."
          }
          else if (this.onBoardCMFormData.lastName.errors && this.onBoardCMFormData.lastName.errors.maxlength) {
            return "Maximum of 25 characters."
          }
          else if (this.onBoardCMFormData.lastName.errors && this.onBoardCMFormData.lastName.errors.pattern) {
            return "No special characters are allowed."
          }
        break;
        case 'gender':
          if (this.onBoardCMFormData.gender.errors && this.onBoardCMFormData.gender.errors.required) {
            return "Gender is required."
          }
        break;
        case 'dob':
          if (this.onBoardCMFormData.dob.errors && this.onBoardCMFormData.dob.errors.required) {
            return "Birthdate is required."
          }
        break;
        case 'street1':
          if (this.onBoardCMFormData.street1.errors && this.onBoardCMFormData.street1.errors.required) {
            return "Address Line is required."
          }
        break;
        case 'street2':
          if (this.onBoardCMFormData.street2.errors && this.onBoardCMFormData.street2.errors.required) {
            return "Address Line is required."
          }
        break;
        case 'city':
          if (this.onBoardCMFormData.city.errors && this.onBoardCMFormData.city.errors.required) {
            return "City is required."
          }
        break;
        case 'state':
          if (this.onBoardCMFormData.state.errors && this.onBoardCMFormData.state.errors.required) {
            return "State is required."
          }
        break;
        case 'country':
          if (this.onBoardCMFormData.country.errors && this.onBoardCMFormData.country.errors.required) {
            return "Country is required."
          }
        break;
        case 'postalCode':
          if (this.onBoardCMFormData.postalCode.errors && this.onBoardCMFormData.postalCode.errors.required) {
            return "Pincode is required."
          }
        break;
        case 'contactNumber':
          if (this.onBoardCMFormData.contactNumber.errors && this.onBoardCMFormData.contactNumber.errors.required) {
            return "Contact number is required."
          }
          else if (this.onBoardCMFormData.contactNumber.errors && this.onBoardCMFormData.contactNumber.errors.pattern) {
            return "Contact number is invalid."
          }
        break;

        case 'emailId':
          if (this.onBoardCMFormData.emailId.errors && this.onBoardCMFormData.emailId.errors.required) {
            return "Email address is required."
          }
          if (this.onBoardCMFormData.emailId.errors && this.onBoardCMFormData.emailId.errors.email) {
            return "Invalid email address."
          }
        break;

        case 'category':
          if (this.workFormData.category.errors && this.workFormData.category.errors.required) {
            return "Service category required."
          }
        break;
        case 'subcategory':
          if (this.workFormData.subcategory.errors && this.workFormData.subcategory.errors.required) {
            return "Sub category required."
          }
        break;
        case 'workexperience':
          if (this.workFormData.workexperience.errors && this.workFormData.workexperience.errors.required) {
            return "Work experience required."
          }
        break;

        case 'skillset':
          if (this.workFormData.skillset.errors && this.workFormData.skillset.errors.required) {
            return "Skillset required."
          }
        break;
      default:
        return 'Something went wrong!';
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
   * Filter and get Sub Category list by Service Category
   * @param Service Category id
   */
  public subCategories:any;
  getSubCategory(name){
    let temp = this.categories.find(
      (category) => (category.name == name.value)
    );
    this.subCategories = temp.subcategory;  
  }

  /**
   * Submit onboarding form
   */
  submitOnboardForm() {

    this.isSubmitted = true;
    
    if(this.onBoardCMForm.valid && this.workForm.valid) {
      let formData = {
        firstName: this.onBoardCMFormData.firstName.value,
        lastName: this.onBoardCMFormData.lastName.value,
        gender: this.onBoardCMFormData.gender.value,
        dob: this.onBoardCMFormData.dob.value,
        email: this.onBoardCMFormData.emailId.value,
        contactNumber: this.onBoardCMFormData.contactNumber.value,
        speciality: this.workFormData.skillset.value,
        experience: parseInt(this.workFormData.workexperience.value),
        category: this.workFormData.category.value,
        subcategory: this.workFormData.subcategory.value,
        address: {
          street1: this.onBoardCMFormData.street1.value,
          street2: this.onBoardCMFormData.street2.value,
          city: this.onBoardCMFormData.city.value,
          state: this.onBoardCMFormData.state.value,
          postalCode: this.onBoardCMFormData.postalCode.value,
          country: this.onBoardCMFormData.country.value,
        },
      };

      this.careManagerService.onboardCM(formData).subscribe(
        (data: any) => {
          //Send account activation and password set link to user's email id
          this.AuthService.resetPassword(this.onBoardCMForm.controls.emailId.value);
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
          this.router.navigate(["/admin/caremanagers"]);
        },
        (error: any) => {
          // console.log("error", error);
          // if(error.message){
            // this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: error.message});          
          // } else {
            this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
          // }          
        }
      );
    }
  }



}
