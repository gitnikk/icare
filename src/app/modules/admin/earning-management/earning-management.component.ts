import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from 'src/app/shared/services/doctor.service';
import { EarningService } from 'src/app/shared/services/earning.service';

export interface Payment {
  id: string;
  payeeType: string;
  payeeId: string;
  payeeName: string;
  transDate: string;
  transMode: string;
  transAmount: string;
  transNote: string;
}

@Component({
  selector: 'app-earning-management',
  templateUrl: './earning-management.component.html',
  styleUrls: ['./earning-management.component.css']
})

export class EarningManagementComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  isDtInitialized:boolean = false;

  paymentList: Payment[] = [];
  modalRef: BsModalRef;

  myForm: FormGroup;
  isSubmitted:boolean = false;

  payeeList:any;

  constructor(
    private router: Router,
    private EarningService: EarningService,
    private modalService: BsModalService,
    private AlertService: AlertService,
    public formBuilder: FormBuilder,
    public DoctorService: DoctorService,
  ) {
    this.myForm = this.formBuilder.group({
      payeeType: new FormControl("Doctor", [Validators.required]),
      payeeId: new FormControl("", [Validators.required]),
      transDate: new FormControl("", [Validators.required]),
      transMode: new FormControl("", [Validators.required]),
      transNote: new FormControl(""),
      transAmount: new FormControl("", [Validators.required]),
    });

  }

  ngOnInit() {
    this.getDoctors();
    this.getPaymentList();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  ngOnDestroy(): void {
    // Unsubscribe the datatable event
    this.dtTrigger.unsubscribe();
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
      case 'payeeType':
        if (this.myFormData.payeeType.errors && this.myFormData.payeeType.errors.required) {
          return "Choose payee type."
        }
      break;
      case 'payeeId':
        if (this.myFormData.payeeId.errors && this.myFormData.payeeId.errors.required) {
          return "Choose payee."
        }
      break;
      case 'transDate':
        if (this.myFormData.transDate.errors && this.myFormData.transDate.errors.required) {
          return "Date is required."
        }
      break;
      case 'transAmount':
        if (this.myFormData.transAmount.errors && this.myFormData.transAmount.errors.required) {
          return "Amount is required."
        }
      break;
      case 'transMode':
        if (this.myFormData.transMode.errors && this.myFormData.transMode.errors.required) {
          return "Select mode of payment."
        }
      break;
      case 'transNote':
        if (this.myFormData.transNote.errors && this.myFormData.transNote.errors.required) {
          return "Note is required."
        }
      break;
    }
  }

  /**
   * submit form action
   */
  onSubmit(){
    this.isSubmitted = true;
    if(this.myForm.valid && this.formAction == "AddForm") {
      this.addEarning();
    } else if(this.myForm.valid && this.formAction == "EditForm"){
      this.updateEarning();
    }
  }

  updateEarning(){
    let formData = {
      payeeId : this.myFormData.payeeId.value,
      payeeType : this.myFormData.payeeType.value,
      transAmount : this.myFormData.transAmount.value,
      transDate : this.myFormData.transDate.value,
      transMode : this.myFormData.transMode.value,
      transNote : this.myFormData.transNote.value,
    }
    this.EarningService.updateEarning(this.editId, formData).subscribe(
      (data: any) => {
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
        this.getPaymentList();
        this.modalRef.hide();
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }

  /**
   * Get Doctors list
   */
  getDoctors() {
    this.DoctorService.getListAllDoctors().subscribe(
      (data: any) => {
        this.payeeList = data.body;
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }


  /**
   * Get payment list
   */
  getPaymentList() {
    this.EarningService.getPaymentList().subscribe(
      (data: any) => {
        this.paymentList = data.body;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
          });
        } else {
            this.isDtInitialized = true;
            this.dtTrigger.next();
        }
      },
      (error: any) => {
        console.log("error", error);
      }
    );
  }

  addEarning(){
    let formData = {
      payeeId : this.myFormData.payeeId.value,
      payeeType : this.myFormData.payeeType.value,
      transAmount : this.myFormData.transAmount.value,
      transDate : this.myFormData.transDate.value,
      transMode : this.myFormData.transMode.value,
      transNote : this.myFormData.transNote.value,
    }
    this.EarningService.addEarning(formData).subscribe(
      (data: any) => {
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
        this.getPaymentList();
        this.modalRef.hide();
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }

  
  
  deleteRecord(memberId){
    // show confirmation message
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: { 
        prompt: {
          title: 'Confirm Delete !', 
          message: "Do you really want to delete this record?",
          buttons: [{action: 'Yes', class: 'btn btn-primary'},{action: 'No', class: 'btn'} ],
        },
        callback: (result) => { 
          if(result == 'Yes'){
            // Delete Api call
            this.EarningService.deleteRecord(memberId)
              .subscribe(data => {
                if((data.body.status) && data.body.status == "error" ){
                  this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: data.body.message});
                } else {
                  this.getPaymentList();
                  this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.DELETE_SUCCESS});
                }
              }, error => {
                this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
              });
          } 
        }
      }
    });
  }


  public editId:string;
  public formAction:string;
  public formDisplayHeader:string;
  openModal(template: TemplateRef<any>, formAction, ele) {
    if(formAction == "AddForm"){
      //clear/reset the form for new entry
      let date = new Date();
      this.editId = "";
      this.formAction = formAction;
      this.formDisplayHeader = "Add new payment details.";
      this.myForm.setValue({
        payeeType: "Doctor",
        payeeId: "",
        transDate:  date.toISOString().substring(0,10),
        transMode: "",
        transNote: "",
        transAmount: ""
      });  
    } else if(formAction == "EditForm"){
      //set the form element
      let date = new Date(ele.transDate);  
      this.editId = ele.id;        
      this.formAction = formAction; 
      this.formDisplayHeader = "Edit payment details.";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      this.myForm.setValue({
        payeeType: ele.payeeType,
        payeeId: ele.payeeId,
        transDate:  date.toISOString().substring(0,10),
        transMode: ele.transMode,
        transNote: ele.transNote,
        transAmount: ele.transAmount
      });
    }
    //open popup window form
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-lg');
  }
  closeModal() {
    this.modalRef.hide();
  }

}
