import { Component, OnInit } from "@angular/core";
import * as $ from 'jquery';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(
    public AuthService:AuthService,
    public router:Router,
    public sessionService: SessionService
  ) {}

  public displayName:string;
  public displayUserType:string;
  public showProfileMenu:boolean = false;
  ngOnInit() {
    this.getLoggedInUserDetails();
    /*---------------------------------------------------------------------
        Header fixed
    -----------------------------------------------------------------------*/
    $(window).scroll(function() {
      if ($(window).scrollTop() >= 75) {
          $('.iq-top-navbar').addClass('fixed-header');
      } else {
          $('.iq-top-navbar').removeClass('fixed-header');
      }
    });

    /*---------------------------------------------------------------------
    Ripple Effect
    -----------------------------------------------------------------------*/
    $(document).on('click', ".iq-waves-effect", function(e) {
        // Remove any old one
        $('.ripple').remove();
        // Setup
        let posX = $(this).offset().left,
            posY = $(this).offset().top,
            buttonWidth = $(this).width(),
            buttonHeight = $(this).height();

        // Add the element
        $(this).prepend("<span class='ripple'></span>");


        // Make it round!
        if (buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }

        // Get the center of the element
        let x = e.pageX - posX - buttonWidth / 2;
        let y = e.pageY - posY - buttonHeight / 2;


        // Add the ripples CSS and start the animation
        $(".ripple").css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");
    });


  }

  getLoggedInUserDetails(){
    this.displayName = this.sessionService.getProfileName(); 
    this.displayUserType = this.sessionService.getUserType(); 
  }
  
  signOut(){
    if(this.sessionService.getUserType() == "PATIENT"){
      this.AuthService.signOut();
      this.router.navigate(['otp-signin']);  
    } else {
      this.AuthService.signOut();
      this.router.navigate(['signin']);
    }    
  }
}
