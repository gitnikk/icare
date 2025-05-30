import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { DoctorService } from "../../../shared/services/doctor.service";
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

export interface Doctor {
  firstName: string;
  lastName: string;
  category: number;
  subcategory: string;
  caseCount: string;
  active: number;
}

@Component({
  selector: "app-doctor-list",
  templateUrl: "./doctor-list.component.html",
  styleUrls: ["./doctor-list.component.css"],
})

export class DoctorListComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  isDtInitialized:boolean = false;

  doctors: Doctor[] = [];
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private AlertService: AlertService,
    private DoctorService: DoctorService
  ) {}

  ngOnInit() {
    this.getDoctors();
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
   * Get doctors list
   */
  getDoctors() {
    this.DoctorService.getListAllDoctors().subscribe(
      (data: any) => {
        this.doctors = data.body;
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

  /**
   * Navigate to doctors onboarding screen
   */
  onboardDoctor() {
    this.router.navigate(["/admin/onboard-doctor"]);
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
            this.DoctorService.deleteRecord(memberId)
              .subscribe(data => {
                if((data.body.status) && data.body.status == "error" ){
                  this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: data.body.message});
                } else {
                  this.getDoctors();
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
