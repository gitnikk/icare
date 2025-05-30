import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { DoctorService } from "../../../shared/services/doctor.service";
import { Router } from "@angular/router";
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';

@Component({
  selector: "app-onboard-doctor",
  templateUrl: "./onboard-doctor.component.html",
  styleUrls: ["./onboard-doctor.component.css"],
})

export class OnboardDoctorComponent implements OnInit {

  public onBoardDoctorForm: FormGroup;
  public workform: FormGroup;
  isSubmitted  =  false;
  mobNumberPattern = "^[0-9]{10}$";

  constructor(
    private AlertService: AlertService,
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private AuthService: AuthService,
    private SharedApiService: SharedApiService
  ) {}

  ngOnInit() {
    this.buildFormGroup();
    this.getServiceCategories();
  }

  buildFormGroup() {
    this.onBoardDoctorForm = this.formBuilder.group({
      firstName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      gender: new FormControl("", [Validators.required]),
      dob: new FormControl("", [Validators.required]),
      contactNumber: new FormControl("", [Validators.required]),
      emailId: new FormControl("", [Validators.required, Validators.email]),
      street1: new FormControl("", [Validators.required, Validators.maxLength(500) ]),
      street2: new FormControl("", [Validators.maxLength(500) ]),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      postalCode: new FormControl("", [Validators.required]),
    });

    this.workform = this.formBuilder.group({
      category: new FormControl("", [Validators.required]),
      subcategory: new FormControl("", [Validators.required]),
      workexperience: new FormControl(""),
      skillset: new FormControl(""),
    });
  }

  /**
   * getter method for doctor details form
   */
  get onBoardDoctorFormData() {
    return this.onBoardDoctorForm.controls;
  }

  /**
   * getter method for work experience form
   */
  get workFormData() {
    return this.workform.controls;
  }

  /**
   * to get error message
   * @param fieldName Field Name
   */
  getErrorMessage(fieldName) {
    switch (fieldName) {
        case 'firstName':
          if (this.onBoardDoctorFormData.firstName.errors && this.onBoardDoctorFormData.firstName.errors.required) {
            return "First Name is required."
          }
          else if (this.onBoardDoctorFormData.firstName.errors && this.onBoardDoctorFormData.firstName.errors.maxlength) {
            return "Maximum of 25 characters."
          }
          else if (this.onBoardDoctorFormData.firstName.errors && this.onBoardDoctorFormData.firstName.errors.pattern) {
            return "No special characters are allowed."
          }
          
        break;
        case 'lastName':
          if (this.onBoardDoctorFormData.lastName.errors && this.onBoardDoctorFormData.lastName.errors.required) {
            return "Last Name is required."
          }
          else if (this.onBoardDoctorFormData.lastName.errors && this.onBoardDoctorFormData.lastName.errors.maxlength) {
            return "Maximum of 25 characters."
          }
          else if (this.onBoardDoctorFormData.lastName.errors && this.onBoardDoctorFormData.lastName.errors.pattern) {
            return "No special characters are allowed."
          }

        break;
        case 'gender':
          if (this.onBoardDoctorFormData.gender.errors && this.onBoardDoctorFormData.gender.errors.required) {
            return "Gender is required."
          }
        break;
        case 'dob':
          if (this.onBoardDoctorFormData.dob.errors && this.onBoardDoctorFormData.dob.errors.required) {
            return "Birthdate is required."
          }
        break;
        case 'street1':
          if (this.onBoardDoctorFormData.street1.errors && this.onBoardDoctorFormData.street1.errors.required) {
            return "Address Line is required."
          }
        break;
        case 'street2':
          if (this.onBoardDoctorFormData.street2.errors && this.onBoardDoctorFormData.street2.errors.required) {
            return "Address Line is required."
          }
        break;
        case 'city':
          if (this.onBoardDoctorFormData.city.errors && this.onBoardDoctorFormData.city.errors.required) {
            return "City is required."
          }
        break;
        case 'state':
          if (this.onBoardDoctorFormData.state.errors && this.onBoardDoctorFormData.state.errors.required) {
            return "State is required."
          }
        break;
        case 'country':
          if (this.onBoardDoctorFormData.country.errors && this.onBoardDoctorFormData.country.errors.required) {
            return "Country is required."
          }
        break;
        case 'postalCode':
          if (this.onBoardDoctorFormData.postalCode.errors && this.onBoardDoctorFormData.postalCode.errors.required) {
            return "Pincode is required."
          }
        break;
        case 'contactNumber':
          if (this.onBoardDoctorFormData.contactNumber.errors && this.onBoardDoctorFormData.contactNumber.errors.required) {
            return "Contact number is required."
          }
          else if (this.onBoardDoctorFormData.contactNumber.errors && this.onBoardDoctorFormData.contactNumber.errors.pattern) {
            return "Contact number is invalid."
          }
        break;

        case 'emailId':
          if (this.onBoardDoctorFormData.emailId.errors && this.onBoardDoctorFormData.emailId.errors.required) {
            return "Email address is required."
          }
          if (this.onBoardDoctorFormData.emailId.errors && this.onBoardDoctorFormData.emailId.errors.email) {
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
    if (this.onBoardDoctorForm.valid && this.workform.valid) {
    // let formData = { ...this.onBoardDoctorForm.value, ...this.workform.value };
    let formData = {
      firstName: this.onBoardDoctorFormData.firstName.value,
      lastName: this.onBoardDoctorFormData.lastName.value,
      gender: this.onBoardDoctorFormData.gender.value,
      dob: this.onBoardDoctorFormData.dob.value,
      email: this.onBoardDoctorFormData.emailId.value,
      contactNumber: this.onBoardDoctorFormData.contactNumber.value,
      speciality: this.workFormData.skillset.value,
      experience: parseInt(this.workFormData.workexperience.value),
      category: this.workFormData.category.value,
      subcategory: this.workFormData.subcategory.value,
      address: {
        street1: this.onBoardDoctorFormData.street1.value,
        street2: this.onBoardDoctorFormData.street2.value,
        city: this.onBoardDoctorFormData.city.value,
        state: this.onBoardDoctorFormData.state.value,
        postalCode: this.onBoardDoctorFormData.postalCode.value,
        country: this.onBoardDoctorFormData.country.value,
      },
    };

    this.doctorService.onboardDoctor(formData).subscribe(
      (data: any) => {
        //Send account activation and password set link to user's email id
        this.AuthService.resetPassword(this.onBoardDoctorForm.controls.emailId.value);
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
        this.router.navigate(["/admin/doctors"]);
      },
      (error: any) => {
        // console.log("error", error);
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }
  }
}
