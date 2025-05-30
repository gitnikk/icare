import { Component, OnInit } from "@angular/core";
import { CaseService } from 'src/app/shared/services/case.service';
import { PageEvent } from '@angular/material';
import { SessionService } from 'src/app/shared/services/common-services/session.service';

@Component({
  selector: 'app-cm-caselist',
  templateUrl: './cm-caselist.component.html',
  styleUrls: ['./cm-caselist.component.css']
})
export class CmCaselistComponent implements OnInit {

  totalElements: number = 0;
  caseList:any = [];
  loading: boolean;
  sortOrder:string;
  sortBy:string;
  sorting:string;

  activeCasesCount:string;

  constructor(private caseService: CaseService, private sessionService:SessionService) { }

  ngOnInit() {
    this.getCareManagerCases();
  }

  /**
   * Get CM Case list
   */
  getCareManagerCases(request = "") {
    this.loading = true;
    this.caseService.getCareManagerCases(this.sessionService.getProfileId(), request)
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
    this.getCareManagerCases("?"+this.sorting);
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
    
    this.getCareManagerCases(pageParam);
  }

}

