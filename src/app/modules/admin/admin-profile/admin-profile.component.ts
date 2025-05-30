import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  modalRef: BsModalRef;
  myProfileForm: FormGroup;
  isSubmitted:boolean = false;
  mobNumberPattern = "^[0-9]{10}$";
  
  @ViewChild('profileImgFileInput', { static: true }) profileImgFileInput: ElementRef;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private AlertService: AlertService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder, 
    private AdminService: AdminService, 
  ) {
    this.buildFormGroup();
  }

  userProfileId:string;
  ngOnInit() {
    this.userProfileId = this.sessionService.getProfileId();
    this.getProfileDetails();
    this.getProfileImg();
  }

  /**
   * Form builder setup
   */
  buildFormGroup(){
    /**
     * My Profile Form
     */
    this.myProfileForm = this.formBuilder.group({
      profileImgFile: new FormControl(null),
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
    });
  }

  /**
   * getter method for profile form data
   */
  get myProfileFormData() {
    return this.myProfileForm.controls;
  }

  /**
   * Get Details of User profile
   */
  public categories:any;
  getProfileDetails(){
    this.AdminService.getAdminProfile(this.userProfileId).subscribe(
      (data: any) => {
        this.bindFormValues(data.body);
        
        // this.categories = data.body.content; 
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }

  bindFormValues(data){
    this.myProfileForm.patchValue({
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
    });
    // console.log("values",this.myProfileFormData);
  }

  /**
  * Return Validation Error Message
  */
  getErrorMessage(fieldName) {
    switch (fieldName) {
      // Profile form Validation messages
      case 'firstName':
        if (this.myProfileFormData.firstName.errors && this.myProfileFormData.firstName.errors.required) {
          return "First Name is required."
        }
        else if (this.myProfileFormData.firstName.errors && this.myProfileFormData.firstName.errors.maxlength) {
          return "Maximum of 25 characters."
        }
      break;
      
      case 'lastName':
        if (this.myProfileFormData.lastName.errors && this.myProfileFormData.lastName.errors.required) {
          return "Last Name is required."
        }
        else if (this.myProfileFormData.lastName.errors && this.myProfileFormData.lastName.errors.maxlength) {
          return "Maximum of 25 characters."
        }
      break;
      
      case 'gender':
        if (this.myProfileFormData.gender.errors && this.myProfileFormData.gender.errors.required) {
          return "Gender is required."
        }
      break;
      
      case 'weight':
        if (this.myProfileFormData.weight.errors && this.myProfileFormData.weight.errors.required) { return "Weight is required" }
      break;
      
      case 'height':
        if (this.myProfileFormData.height.errors && this.myProfileFormData.height.errors.required) { return "Height is required" }
      break;

      case 'street1':
        if (this.myProfileFormData.street1.errors && this.myProfileFormData.street1.errors.required) {
          return "Address Line is required."
        }
        else if (this.myProfileFormData.street1.errors && this.myProfileFormData.street1.errors.maxlength) {
          return "Maximum of 500 characters."
        }
      break;
      
      case 'street2':
        if (this.myProfileFormData.street2.errors && this.myProfileFormData.street2.errors.maxlength) {
          return "Maximum of 500 characters."
        }
      break;
      
      case 'city':
        if (this.myProfileFormData.city.errors && this.myProfileFormData.city.errors.required) {
          return "City is required."
        }
      break;

      case 'state':
        if (this.myProfileFormData.state.errors && this.myProfileFormData.state.errors.required) {
          return "State is required."
        }
      break;

      case 'country':
        if (this.myProfileFormData.country.errors && this.myProfileFormData.country.errors.required) {
          return "Country is required."
        }
      break;

      case 'postalCode':
        if (this.myProfileFormData.postalCode.errors && this.myProfileFormData.postalCode.errors.required) {
          return "Pincode is required."
        }
      break;

      case 'nationality':
        if (this.myProfileFormData.nationality.errors && this.myProfileFormData.nationality.errors.required) {
          return "Nationality is required."
        }
      break;

      case 'occupation':
        if (this.myProfileFormData.occupation.errors && this.myProfileFormData.occupation.errors.required) {
          return "Occupation is required."
        }
      break;
      
      case 'dob':
        if (this.myProfileFormData.dob.errors && this.myProfileFormData.dob.errors.required) {
          return "Date of birth is required."
        }
      break;

      case 'contactNumber':
        if (this.myProfileFormData.contactNumber.errors && this.myProfileFormData.contactNumber.errors.required) {
          return "Contact number is required."
        }
        else if (this.myProfileFormData.contactNumber.errors && this.myProfileFormData.contactNumber.errors.pattern) {
          return "Contact number is invalid."
        }
      break;
  
      default:
        return 'Something went wrong!';
    }
  }


  /**
   * My profile for submit
   */
  onSubmit(){
    this.isSubmitted = true;
    if(this.myProfileForm.valid) {
      let formData = this.setApiRequest();
      this.AdminService.updateMyProfile(this.userProfileId, formData).subscribe(
        (data: any) => {
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.UPDATE_SUCCESS});
          this.router.navigate(['/admin/dashboard']);
        },
        (error: any) => {
          // console.log("error", error);
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        }
      );
    }  
  }

  /**
   * Configure the request body for update profile api 
   */
  setApiRequest(){
    return {
      firstName: this.myProfileFormData.firstName.value,
      lastName: this.myProfileFormData.lastName.value,
      contactNumber: this.myProfileFormData.contactNumber.value,
      address :{
        street1: this.myProfileFormData.street1.value,
        street2: this.myProfileFormData.street2.value,
        city: this.myProfileFormData.city.value,
        state: this.myProfileFormData.state.value,
        postalCode: this.myProfileFormData.postalCode.value,
        country: this.myProfileFormData.country.value,
      },
      dob: this.myProfileFormData.dob.value,
      gender: this.myProfileFormData.gender.value,
    }

    
  }

  public profileImgFile: File = null;
  private profileImg_max_size: number = 1048576;
  onFileChange(event) {
    this.profileImgFile = null;
    if (event.target.files.length > 0) {
      // Don't allow file sizes over 1MB
      if (event.target.files[0].size < this.profileImg_max_size){
        this.profileImgFile = event.target.files[0];
        this.uploadFile();
      } else {
        // show alert message for error
        this.modalRef = this.modalService.show(ConfirmModalComponent, {
          initialState: { 
            prompt: {
              title: 'Invalid File Error.', 
              message: "Upload file size should be less than 1 MB.",
              buttons: [{action: 'Ok', class: 'btn btn-primary'}],
            },
            callback: (result) => { if(result == 'Ok'){ } }
          }
        });
      }
      
    }
    // reset file input file is invalid
    this.profileImgFileInput.nativeElement.value = "";
  }

  uploadFile(){
    let formData = new FormData();
    formData.append('type', "profileImage");
    formData.append('file', this.profileImgFile);

    this.AdminService.uploadFile(formData).subscribe(
      (data: any) => {        
        if(data.body.message == "File Upload Successfully"){
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: data.body.message});
          this.getProfileImg();
        } else {
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        }
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        // console.log("error", error);
      }
    );
  }

  public profileImageUrl:string="";
  getProfileImg(){
    let formData = new FormData();
    formData.append('type', "profileImage");
    
    this.AdminService.getSignedUrl(formData).subscribe(
      (data: any) => {
        this.profileImageUrl = data.body.file;
      },
      (error: any) => {
        // this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }
}


