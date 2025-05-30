import { Component, OnInit, ViewChild } from '@angular/core';
import { CaseService } from 'src/app/shared/services/case.service';
import { PageEvent } from '@angular/material';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-patient-cases',
  templateUrl: './patient-cases.component.html',
  styleUrls: ['./patient-cases.component.css']
})
export class PatientCasesComponent implements OnInit {
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  isDtInitialized:boolean = false;
  
  totalElements: number = 0;
  caseList:any = [];
  loading: boolean;
  sortOrder:string;
  sortBy:string;
  sorting:string;

  activeCasesCount:string;

  constructor(private caseService: CaseService, private sessionService: SessionService) { }

  ngOnInit() {
    this.getPatientCases();
    
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
   * Get Case list of patient
   */
  getPatientCases(request = "") {

    this.loading = true;
    this.caseService.getPatientCases(this.sessionService.getProfileId(), request)
      .subscribe(data => {
        // console.log(data.body['content']);
        this.caseList = data.body['content'];
        
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
          });
        } else {
            this.isDtInitialized = true;
            this.dtTrigger.next();
        }

        this.activeCasesCount = data.body['content'].length;
        this.totalElements = data.body['totalElements'];
        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  /**
   * Table column Sort
   */
  // sort(sortBy){
  //   this.sortBy = sortBy;
  //   (this.sortOrder == 'ASC')? this.sortOrder = 'DESC' : this.sortOrder = 'ASC';
  //   this.sorting = "sort="+this.sortBy+","+this.sortOrder; 
  //   this.getPatientCases("?"+this.sorting);
  // }

  /**
   * Table change page
   */
  // nextPage(event: PageEvent) {
  //   let s = "";
  //   if(this.sorting && this.sorting != "")
  //     s = "&"+this.sorting;
  //   let pageParam = "?page="+event.pageIndex.toString()
  //                   + "&size="+event.pageSize.toString()
  //                   + s;
    
  //   this.getPatientCases(pageParam);
  // }

}
