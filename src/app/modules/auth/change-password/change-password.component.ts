import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mustMatch } from 'src/app/shared/custom.validator';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder, 
    private router: Router,
    private AlertService: AlertService,
    private AuthService: AuthService       
  ) {
    this.myForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: mustMatch('password', 'confirmPassword')
    });
  }

  myForm: FormGroup;
  isSubmitted:boolean = false;

  ngOnInit() {
  }

  /**
  * getter method
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
        case 'password':
          if (this.myFormData.password.errors && this.myFormData.password.errors.required) {
            return "Password required."
          }
        break;
        case 'confirmPassword':
          if (this.myFormData.confirmPassword.errors && this.myFormData.confirmPassword.errors.required) {
            return "Confirm password required."
          }
          if (this.myFormData.confirmPassword.errors && this.myFormData.confirmPassword.errors.mustMatch) {
            return "Password must match."
          }
        break;
      default:
        return 'Something went wrong!';
    }
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.myForm.valid) {
      // this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.PASSWORD_SET_SUCCESS});
      
      this.AuthService.changeFirebasePassword({"password":this.myFormData.password.value}).subscribe(
        (data: any) => {        
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: data.body.message});
        },
        (error: any) => {
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
          // console.log("error", error);
        }
      );
    }
  }

}
