import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { CareManagerService } from 'src/app/shared/services/caremanager.service';
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';

declare var require: any

@Component({
  selector: 'app-cm-profile',
  templateUrl: './cm-profile.component.html',
  styleUrls: ['./cm-profile.component.css']
})

export class CmProfileComponent implements OnInit {
  modalRef: BsModalRef;
  myProfileForm: FormGroup;
  isSubmitted:boolean = false;
  cmUserId:string;
  mobNumberPattern = "^[0-9]{10}$";
  categories:any;
  subCategories:any;
  
  @ViewChild('profileImgFileInput', { static: true }) profileImgFileInput: ElementRef;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private AlertService: AlertService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder, 
    private CareManagerService: CareManagerService, 
    private SharedApiService: SharedApiService,
  ) {
    this.buildFormGroup();
  }

  
  ngOnInit() {
    this.cmUserId = this.sessionService.getProfileId();
    this.getServiceCategories();
    this.getProfileImg();
  }

  /**
   * Form builder config
   */
  buildFormGroup(){
    this.myProfileForm = this.formBuilder.group({
      // profileImgFile: new FormControl(null),
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
      workexperience: new FormControl(""),
      skillset: new FormControl(""),
      category: new FormControl("", [Validators.required]),
      subcategory: new FormControl("", [Validators.required]),
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
  getProfileDetails(){
    this.CareManagerService.getCMProfile(this.cmUserId).subscribe(
      (data: any) => {
        this.bindFormValues(data.body);
        this.getSubCategory(this.myProfileFormData.category.value);
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
      workexperience: parseInt(data.experience),
      skillset: data.speciality,
      category: data.category,
      subcategory: data.subcategory,
    });

    // bind list of uploaded files
    this.certificateFiles = data.uploadReports;
  }


  /**
   * Get Service Category and Sub Category list
   */
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
  getSubCategory(name){
    let temp = this.categories.find(
      (category) => (category.name == name)
    );
    this.subCategories = temp.subcategory;  
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
  
      case 'workexperience':
        if (this.myProfileFormData.workexperience.errors && this.myProfileFormData.workexperience.errors.required) {
          return "Work experience is required."
        }
      break;

      case 'skillset':
        if (this.myProfileFormData.skillset.errors && this.myProfileFormData.skillset.errors.required) {
          return "Skillset is required."
        }
      break;
      case 'category':
        if (this.myProfileFormData.category.errors && this.myProfileFormData.category.errors.required) {
          return "Skillset is required."
        }
      break;
      case 'subcategory':
        if (this.myProfileFormData.subcategory.errors && this.myProfileFormData.subcategory.errors.required) {
          return "Skillset is required."
        }
      break;

      default:
        return 'Something went wrong!';
    }
  }

  /**
   * Get file name from the file path
   * @param filePath 
   */
  getOnlyFileName(filePath){
    return filePath.substring((filePath.lastIndexOf("/")+1));
  }
  
  

  /**
   * Set file to the upload entity
   * @param uploadType 
   */
  public file_profileImage: File;
  public file_certificate: File;
  public certificateFiles = new Array();

  onFileChange(event, uploadType) {

    if (event.target.files.length > 0 && event.target.files[0].size >= 1048576){
      // show alert message for error
      this.modalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: { 
          prompt: {
            title: 'Invalid File Error.', 
            message: "Upload file size should be less than 1 MB.",
            buttons: [{action: 'Ok', class: 'btn btn-primary'}],
          },
          callback: (result) => { if(result == 'Ok'){ return; } }
        }
      });
      return;
    }

      const file = event.target.files[0];
      switch(uploadType){
        case "profileImage" :
          // Allow only image file
          if(event.target.files[0].type.indexOf("image")==-1){
            // show alert message for error
            this.modalRef = this.modalService.show(ConfirmModalComponent, {
              initialState: { 
                prompt: {
                  title: 'Invalid File Error.', 
                  message: "Only JPG, JPEG, PNG Files are allowed.",
                  buttons: [{action: 'Ok', class: 'btn btn-primary'}],
                },
                callback: (result) => { if(result == 'Ok'){ return; } }
              }
            });
          } else {
            this.file_profileImage = file;
            this.uploadFile(uploadType);            
          }
        break;
        case "certificateFile" :
          this.file_certificate = file;
        break;
      }
       
  }

  /**
   * Upload file
   * @param uploadType 
   */
  uploadFile(uploadType){
    let formData = new FormData();
    switch(uploadType){
      case 'profileImage' : {
        formData.append('type', "profileImage");
        formData.append('file', this.file_profileImage);
      }
      break;
      case 'certificateFile' : {
        formData.append('type', "uploadDocuments");
        formData.append('file', this.file_certificate);
      }
      break;
    }

    this.CareManagerService.uploadFile(formData).subscribe(
      (data: any) => {        
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.FILE_UPLOAD_SUCCESS});
        switch(uploadType) {
          case "profileImage":
            this.file_profileImage = null;
            this.getProfileImg();
          break;
          case "certificateFile":
            this.certificateFiles.push(this.file_certificate.name);
            this.file_certificate = null;
          break;
        } 
        
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        // console.log("error", error);
      }
    );
  }

  /**
   * Get Profile image signed url
   */
  public profileImageUrl:string="";
  getProfileImg(){
    let formData = new FormData();
    formData.append('type', "profileImage");
    formData.append('file', null);
    
    this.CareManagerService.getSignedUrl(formData).subscribe(
      (data: any) => {
        this.profileImageUrl = data.body.file;
      },
      (error: any) => {
        // this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }

  /**
   * Get Signed URL to download the file from GCP
   * @param type 
   * @param filename 
   */
  getSignedUrl(type, filename){
    let formData = new FormData();
    formData.append('type', type);
    formData.append('file', filename);    
    
    this.CareManagerService.getSignedUrl(formData).subscribe(
      (data: any) => {
        var FileSaver = require('file-saver');
        FileSaver.saveAs(data.body.file, filename);
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }




  /**
   * Update CM details
   */
  onSubmit(){
    this.isSubmitted = true;
    if(this.myProfileForm.valid) {
      let formData = this.setApiRequest();
      this.CareManagerService.updateMyProfile(this.cmUserId, formData).subscribe(
        (data: any) => {
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.UPDATE_SUCCESS});
          this.router.navigate(['/caremanager/home']);
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
      experience: this.myProfileFormData.workexperience.value,
      speciality: this.myProfileFormData.skillset.value,
      category: this.myProfileFormData.category.value,
      subcategory: this.myProfileFormData.subcategory.value,
    }
  }


}

