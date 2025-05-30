import { Injectable } from '@angular/core';
import { NgxBootstrapAlertNotificationService } from '@benevideschissanga/ngx-bootstrap-alert-notification';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  
  constructor(private NotificationService: NgxBootstrapAlertNotificationService) { }

  showAlert(param){
    this.NotificationService.show(
      {
        type: param.type,
        message: param.message,
        // icon: 'ri-women-fill',
        title: param.title,
      },
      {
        position: 'topRight'
      }
    )
  }
}
