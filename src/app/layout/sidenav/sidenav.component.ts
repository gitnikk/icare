import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as $ from 'jquery';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.css"],
})
export class SidenavComponent implements OnInit {
  constructor(private router: Router, public sessionService: SessionService) {}

  ngOnInit() {
    /*---------------------------------------------------------------------
      Page Menu
    -----------------------------------------------------------------------*/
    $(document).on('click', '.wrapper-menu', function() {
      $(this).toggleClass('open');
      $("body").toggleClass("sidebar-main");
    });

  }
}
