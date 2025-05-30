import { Component, OnInit } from "@angular/core";
import { CaseService } from 'src/app/shared/services/case.service';
import { PageEvent } from '@angular/material';
import { SessionService } from 'src/app/shared/services/common-services/session.service';

@Component({
  selector: "app-doctors-dashboard",
  templateUrl: "./doctors-dashboard.component.html",
  styleUrls: ["./doctors-dashboard.component.css"],
})
export class DoctorsDashboardComponent implements OnInit {

  totalElements: number = 0;
  caseList:any = [];
  loading: boolean;
  sortOrder:string;
  sortBy:string;
  sorting:string;

  activeCasesCount:string;

  constructor(private caseService: CaseService, private sessionService: SessionService) { }

  ngOnInit() {
    this.getDoctorCases();
  }

  /**
   * Get Case list of Doctor
   */
  getDoctorCases(request = "") {

    this.loading = true;
    this.caseService.getDoctorCases(this.sessionService.getProfileId(), request)
      .subscribe(data => {
        // console.log(data.body['content']);
        this.caseList = data.body['content'];
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
  sort(sortBy){
    this.sortBy = sortBy;
    (this.sortOrder == 'ASC')? this.sortOrder = 'DESC' : this.sortOrder = 'ASC';
    this.sorting = "sort="+this.sortBy+","+this.sortOrder; 
    this.getDoctorCases("?"+this.sorting);
  }

  /**
   * Table change page
   */
  nextPage(event: PageEvent) {
    let s = "";
    if(this.sorting && this.sorting != "")
      s = "&"+this.sorting;
    let pageParam = "?page="+event.pageIndex.toString()
                    + "&size="+event.pageSize.toString()
                    + s;
    
    this.getDoctorCases(pageParam);
  }

}
