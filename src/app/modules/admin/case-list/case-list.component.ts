import { Component, OnInit, ViewChild } from '@angular/core';
import { CaseService } from 'src/app/shared/services/case.service';
import { MatPaginator } from "@angular/material";

import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})


export class CaseListComponent implements OnInit {

  totalElements: number = 0;
  caseList:any = [];
  loading: boolean;
  sortOrder:string;
  sortBy:string;
  sorting:string;
  constructor(private caseService: CaseService) { }

  ngOnInit() {
    this.getAllCases();
  }



  /**
   * Get all Case list
   */
  getAllCases(request = "") {

    this.loading = true;
    this.caseService.getAllCases(request)
      .subscribe(data   => {
        // console.log(data.body['content']);
        this.caseList = data.body['content'];
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
    this.getAllCases("?"+this.sorting);
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
    
    this.getAllCases(pageParam);
  }

}
