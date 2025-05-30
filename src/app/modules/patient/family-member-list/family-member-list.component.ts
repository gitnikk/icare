import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { PatientService } from 'src/app/shared/services/patient.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';

@Component({
  selector: 'app-family-member-list',
  templateUrl: './family-member-list.component.html',
  styleUrls: ['./family-member-list.component.css']
})
export class FamilyMemberListComponent implements OnInit {
  
  modalRef: BsModalRef;
  familyMemberList:any = [];
  
  constructor(
    private PatientService: PatientService, 
    private sessionService: SessionService,
    private modalService: BsModalService,
    private AlertService: AlertService,
    ) { }

  ngOnInit() {
    this.getFamilyMembers();
  }

  /**
   * Get Case list of patient
   */
  getFamilyMembers(request = "") {
    this.PatientService.getFamilyMembersList(this.sessionService.getProfileId())
      .subscribe(data => {
        this.familyMemberList = data.body.familyMembers;
      }, error => {
      });
  }

  deleteMember(memberId){
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
            this.PatientService.deleteFamilyMember(memberId)
              .subscribe(data => {
                this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.DELETE_SUCCESS});
              }, error => {
                this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
              });
          } 
        }
      }
    });
  }
}

