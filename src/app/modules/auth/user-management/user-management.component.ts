import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mustMatch } from 'src/app/shared/custom.validator';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  setPasswordForm: FormGroup;
  actionCodeChecked:boolean;
  actionCode:any;

  mode:any;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private AuthService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder:FormBuilder, 
    private AlertService: AlertService,
    private modalService: BsModalService, 
  ) {
    this.setPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: mustMatch('password', 'confirmPassword')
    });
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

  /**
  * getter method
  */
  get setPasswordFormData() {
    return this.setPasswordForm.controls;
  }

  modalRef: BsModalRef;
  errorMsg:any;
  title = "Processing...";
  message = "Stay tune, It will take some time...";
  isSubmitted  =  false;

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        this.mode = params['mode'];
        this.actionCode = params['oobCode'];

        switch (this.mode) {
          case "resetPassword": {
            // Verify the password reset code is valid.
            this.AuthService.getAuth().verifyPasswordResetCode(this.actionCode).then(email => {
              this.actionCodeChecked = true;
            }).catch(e => {
              this.actionCodeChecked = false;
              this.mode = "invalidLink";
              this.title = "Invalid Link";
              this.message = "The link you are trying to access is either expired or invalid, please contact to admin.";
            });
          } 
          break;
        
          case "verifyEmail": {
            this.AuthService.getAuth().checkActionCode(this.actionCode).then(email=> {
              this.actionCodeChecked = true;
              this.handleVerifyEmail();
            }).catch(e=>{
              this.actionCodeChecked = false;
              this.mode = "invalidLink";
              this.title = "Invalid Link";
              this.message = "The link you are trying to access is either expired or invalid, please contact to admin.";
            })

          } 
          break;
          default: {
            this.actionCodeChecked = false;
            this.title = "Invalid Link";
            this.message = "The link you are trying to access is either expired or invalid, please contact to admin.";
          }
        }
      })
  } //  ngOnInit : e


  
  /**
   * Attempt to confirm the password reset with firebase and
   * navigate user back to home.
   */
  handleResetPassword() {
    this.isSubmitted = true;
    if(this.setPasswordForm.valid) {
      // Save the new password.
      this.AuthService.getAuth().confirmPasswordReset(
          this.actionCode,   
          this.setPasswordFormData.password.value
      )
      .then(resp => {
        // Password reset has been confirmed and new password updated.
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.PASSWORD_SET_SUCCESS});
        this.router.navigate(['/signin']);
      }).catch(e => {
        // Error occurred during confirmation. The code might have
        // expired or the password is too weak.
        // this.actionCodeChecked = false;
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: e});
      });
    }
  }

  /**
   * Attempt to verify email with firebase and
   * navigate user back to signin.
   */
  handleVerifyEmail() {
    this.AuthService.getAuth().applyActionCode(this.actionCode)
      .then(resp => {
        this.title = "Account activated";
        this.message = "Your yCare account activated successfully. You can login to your account now.";

        // this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: "Your yCare account activated successfully. Thank you."});
      }).catch(e => {
        this.mode = "invalidLink";
        this.title = "Invalid Link";
        this.message = "The link you are trying to access is either expired or invalid, please contact to admin.";
        
        // this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: e});
      });

  }

  /**
   * to get error message
   * @param fieldName Field Name
   */
  getErrorMessage(fieldName) {
    switch (fieldName) {
        case 'password':
          if (this.setPasswordFormData.password.errors && this.setPasswordFormData.password.errors.required) {
            return "Password required."
          }
        break;
        case 'confirmPassword':
          if (this.setPasswordFormData.confirmPassword.errors && this.setPasswordFormData.confirmPassword.errors.required) {
            return "Confirm password required."
          }
          if (this.setPasswordFormData.confirmPassword.errors && this.setPasswordFormData.confirmPassword.errors.mustMatch) {
            return "Password must match."
          }
        break;
      default:
        return 'Something went wrong!';
    }
  }

  ngOnDestroy() {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
