import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { CareManagerService } from "../../../shared/services/caremanager.service";
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

export interface CareManager {
  firstName: string;
  lastName: string;
  category: number;
  subcategory: string;
  caseCount: string;
  active: number;
}

@Component({
  selector: "app-care-manager-list",
  templateUrl: "./care-manager-list.component.html",
  styleUrls: ["./care-manager-list.component.css"],
})

export class CareManagerListComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  isDtInitialized:boolean = false;

  careManagers: CareManager[] = [];
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private CareManagerService: CareManagerService,
    private modalService: BsModalService,
    private AlertService: AlertService,
  ) {}

  ngOnInit() {
    this.getCareManagers();

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
   * Get care managers list
   */
  getCareManagers() {
    this.CareManagerService.getListAllCM().subscribe(
      (data: any) => {
        this.careManagers = data.body;
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

  
  OnboardCM() {
    this.router.navigate(["/admin/onboard-caremanager"]);
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
            this.CareManagerService.deleteRecord(memberId)
              .subscribe(data => {
                if((data.body.status) && data.body.status == "error" ){
                  this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: data.body.message});
                } else {
                  this.getCareManagers();
                  this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.DELETE_SUCCESS});
                }
              }, error => {
                console.log(error);
                this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
              });
          } 
        }
      }
    });
  }
}
