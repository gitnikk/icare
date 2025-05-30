import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CareManagerService } from 'src/app/shared/services/caremanager.service';
import { DoctorService } from 'src/app/shared/services/doctor.service';
import { CaseService } from 'src/app/shared/services/case.service';
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';


@Component({
  selector: 'app-case-allocation',
  templateUrl: './case-allocation.component.html',
  styleUrls: ['./case-allocation.component.css']
})
export class CaseAllocationComponent implements OnInit {
  modalRef: BsModalRef;
  caseId:any;
  caseDetails = {
    "id":"",
    "patientName":"",
    "categoryName":"",
    "subCategoryName":"",
    "presentHealthComplaints":{"answer":""},
    "createDateTime":"",
    "doctorId":"",
    "caremanagerId":"",
    "categoryId":"",
    "subCategoryId":""
  };
  caremanagers:any;
  doctors:any;
  selectedDoctor:any;
  assignedDoctor:any;
  selectedCM:any;
  assignedCM:any = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private careManagerService: CareManagerService,
    private doctorService: DoctorService,
    private caseService: CaseService,
    private sharedApiService : SharedApiService,
    private AlertService: AlertService
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // console.log("ID",params['id']);
      this.caseId = params['id'];
      this.getCaseDetails();
    });
    
    

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-lg');
  }
  closeModal() {
    this.modalRef.hide();
  }

  /**
   * Get case details
   */  
  getCaseDetails() {
    this.caseService.getCaseDetails(this.caseId).subscribe(
      (data: any) => {
        this.caseDetails = data.body;
        this.getCareManagers();
        this.getDoctors();
        
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }

  /**
   * Get care managers list
   */
  getCareManagers() {
    this.careManagerService.getCMList().subscribe(
      (data: any) => {
        this.caremanagers = data.body;
        if(this.caseDetails.caremanagerId){
          this.selectedCM = this.caremanagers.find(cm => (cm.id == this.caseDetails.caremanagerId));
          this.assignedCM = this.selectedCM;
        }
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }
  /**
   * Get Doctors list
   */
  getDoctors() {
    this.doctorService.getDoctorsList().subscribe(
      (data: any) => {
        this.doctors = data.body;
        if(this.caseDetails.doctorId){
          this.selectedDoctor = this.doctors.find(doctor => (doctor.id == this.caseDetails.doctorId));
          this.assignedDoctor = this.selectedDoctor;
        }
        // console.log("Doctor : ",this.doctors);
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }

  /**
   * Reset CM assigned to case
   */
  resetCm() {
    // confirmation alert
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        prompt: {
          title: 'Confirm', 
          message: 'Are you sure you want to reset care manager?',
          buttons: [{action: 'Yes', class: 'btn btn-primary'}, {action: 'No', class:'btn btn-light'}],
        },
        callback: (result) => {
          if (result == 'Yes'){
            this.caseService.resetCm(this.caseId).subscribe(
              (data: any) => {
                this.caseDetails.caremanagerId = this.selectedCM = this.assignedCM = null;
                this.getCareManagers();
                this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.RESET_SUCCESS});
              },
              (error: any) => {
                this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
                // console.log("error", error);
              }
            );
          }
        }
      }
    });

  }

  /**
   * Reset Doctor assigned to case
   */
  resetDoctor() {
    // confirmation alert
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        prompt: {
          title: 'Confirm', 
          message: 'Are you sure you want to reset doctor?',
          buttons: [{action: 'Yes', class: 'btn btn-primary'}, {action: 'No', class:'btn btn-light'}],
        },
        callback: (result) => {
          if (result == 'Yes'){
            this.caseService.resetDoctor(this.caseId).subscribe(
              (data: any) => {
                this.caseDetails.doctorId = this.selectedDoctor = this.assignedDoctor = null;
                this.getDoctors();
                this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.RESET_SUCCESS});
              },
              (error: any) => {
                // console.log("error", error);
              }
            );
          }
        }
      }
    });
    
  }

  /**
   * Assign Doctor to Case
   */
  assignDoctor() {
    let data = {
      id: this.selectedDoctor.id
    }
    this.caseService.assignDoctor(this.caseId, data).subscribe(
      (data: any) => {
        this.assignedDoctor = this.selectedDoctor;
        this.caseDetails.doctorId = this.assignedDoctor.id; 
        this.getDoctors();
        this.closeModal();
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.UPDATE_SUCCESS});
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        // console.log("error", error);
      }
    );
  }

  /**
   * Assign Doctor to Case
   */
  assignCM() {
    let data = {
      id: this.selectedCM.id
    }
    this.caseService.assignCM(this.caseId, data).subscribe(
      (data: any) => {
        this.assignedCM = this.selectedCM;
        this.caseDetails.caremanagerId = this.assignedCM.id;
        this.getCareManagers();
        this.closeModal();
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.UPDATE_SUCCESS});
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        // console.log("error", error);
      }
    );
  }
  
  
}
