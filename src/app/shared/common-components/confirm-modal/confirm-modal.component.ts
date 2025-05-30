import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

    constructor(public _bsModalRef: BsModalRef) { }

    public ngOnInit(): void { }
    public prompt = {
      title: 'Error', 
      message: 'Something goes wrong?',
      buttons: [{action: 'Close', class: 'btn btn-primary'}],
    }
    performAction(action) {
      if (this._bsModalRef.content.callback != null){
        this._bsModalRef.content.callback(action);
        this._bsModalRef.hide();
      }
    }

}
