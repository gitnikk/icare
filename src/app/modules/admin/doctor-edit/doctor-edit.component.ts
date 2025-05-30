import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl, } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DoctorService } from 'src/app/shared/services/doctor.service';

@Component({
  selector: 'app-doctor-edit',
  templateUrl: './doctor-edit.component.html',
  styleUrls: ['./doctor-edit.component.css']
})

export class DoctorEditComponent implements OnInit {
  public modalRef: BsModalRef;
  public myForm: FormGroup;
  public isSubmitted  =  false;
  public mobNumberPattern = "^[0-9]{10}$";
  public doctorUserId;
  constructor(
    private route: ActivatedRoute,
    private AlertService: AlertService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private DoctorService: DoctorService,
    private router: Router,
    private AuthService: AuthService,
    private SharedApiService: SharedApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.doctorUserId = params['id'];
    })
    this.buildFormGroup();
    this.getServiceCategories();
  }

  buildFormGroup() {
    this.myForm = this.formBuilder.group({
      firstName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl("", [Validators.required, Validators.maxLength(25)]),
      gender: new FormControl("", [Validators.required]),
      dob: new FormControl(null, [Validators.required]),
      contactNumber: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      street1: new FormControl("", [Validators.required, Validators.maxLength(500)]),
      street2: new FormControl("", [Validators.maxLength(500)]),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      postalCode: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      subcategory: new FormControl("", [Validators.required]),
      workexperience: new FormControl(""),
      skillset: new FormControl(""),
      accountStatus: new FormControl(""),
    });
  }

  /**
   * getter method for cm details form
   */
  get myFormData() {
    return this.myForm.controls;
  } 

  /**
   * to get error message
   * @param fieldName Field Name
   */
  getErrorMessage(fieldName) {
    switch (fieldName) {
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
        case 'gender':
          if (this.myFormData.gender.errors && this.myFormData.gender.errors.required) {
            return "Gender is required."
          }
        break;
        case 'dob':
          if (this.myFormData.dob.errors && this.myFormData.dob.errors.required) {
            return "Birthdate is required."
          }
        break;
        case 'street1':
          if (this.myFormData.street1.errors && this.myFormData.street1.errors.required) {
            return "Address Line is required."
          }
        break;
        case 'street2':
          if (this.myFormData.street2.errors && this.myFormData.street2.errors.required) {
            return "Address Line is required."
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
        case 'country':
          if (this.myFormData.country.errors && this.myFormData.country.errors.required) {
            return "Country is required."
          }
        break;
        case 'postalCode':
          if (this.myFormData.postalCode.errors && this.myFormData.postalCode.errors.required) {
            return "Pincode is required."
          }
        break;
        case 'contactNumber':
          if (this.myFormData.contactNumber.errors && this.myFormData.contactNumber.errors.required) {
            return "Contact number is required."
          }
          else if (this.myFormData.contactNumber.errors && this.myFormData.contactNumber.errors.pattern) {
            return "Contact number is invalid."
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

        case 'category':
          if (this.myFormData.category.errors && this.myFormData.category.errors.required) {
            return "Service category required."
          }
        break;
        case 'subcategory':
          if (this.myFormData.subcategory.errors && this.myFormData.subcategory.errors.required) {
            return "Sub category required."
          }
        break;
        case 'workexperience':
          if (this.myFormData.workexperience.errors && this.myFormData.workexperience.errors.required) {
            return "Work experience required."
          }
        break;

        case 'skillset':
          if (this.myFormData.skillset.errors && this.myFormData.skillset.errors.required) {
            return "Skillset required."
          }
        break;
        case 'accountStatus':
          if (this.myFormData.skillset.errors && this.myFormData.skillset.errors.required) {
            return "Select account status."
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
        this.getProfileDetails();
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
      (category) => (category.name == name)
    );
    this.subCategories = temp.subcategory;  
  }


  /**
   * Get Details of User profile
   */
  getProfileDetails(){
    this.DoctorService.getDoctorProfile(this.doctorUserId).subscribe(
      (data: any) => {
        this.bindFormValues(data.body);
        this.getSubCategory(this.myFormData.category.value);
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }

  /**
   * Bind the formData
   * @param data 
   */
  bindFormValues(data){
    this.myForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contactNumber: data.contactNumber,
      street1: (data.address && data.address.street1) ? data.address.street1 : "",   
      street2: (data.address && data.address.street2) ? data.address.street2 : "",   
      city: (data.address && data.address.city) ? data.address.city : "",   
      state: (data.address && data.address.state) ? data.address.state : "",   
      postalCode: (data.address && data.address.postalCode) ? data.address.postalCode : "",   
      country: (data.address && data.address.country) ? data.address.country : "",
      dob: data.dob,
      gender: data.gender,
      workexperience: parseInt(data.experience),
      skillset: data.speciality,
      category: data.category,
      subcategory: data.subcategory,
      accountStatus: data.active,
    });


  }
  /**
   * Submit update form
   */
  submitForm() {

    this.isSubmitted = true;
    
    if(this.myForm.valid && this.myForm.valid) {
      let formData = {
        firstName: this.myFormData.firstName.value,
        lastName: this.myFormData.lastName.value,
        gender: this.myFormData.gender.value,
        dob: this.myFormData.dob.value,
        email: this.myFormData.email.value,
        contactNumber: this.myFormData.contactNumber.value,
        speciality: this.myFormData.skillset.value,
        experience: parseInt(this.myFormData.workexperience.value),
        category: this.myFormData.category.value,
        subcategory: this.myFormData.subcategory.value,
        address: {
          street1: this.myFormData.street1.value,
          street2: this.myFormData.street2.value,
          city: this.myFormData.city.value,
          state: this.myFormData.state.value,
          postalCode: this.myFormData.postalCode.value,
          country: this.myFormData.country.value,
        },
        active: this.myFormData.accountStatus.value,
      };

      this.DoctorService.updateCM(this.doctorUserId ,formData).subscribe(
        (data: any) => {
          if((data.body.status) && data.body.status == "error" ){
            this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: data.body.message});
          } else {
            this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.UPDATE_SUCCESS});
            this.router.navigate(["/admin/doctors"]);
          }
        },
        (error: any) => {
          // console.log("error", error);
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        }
      );
    }
  }



}


