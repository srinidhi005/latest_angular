import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent{
  
  constructor(
    public dialogRef: MatDialogRef<MessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfig
  ) {}

  onNoClick(): void {
    this.dialogRef.close();    
  }
}

export interface DialogConfig {
  okButtonMsg: string;
  noButtonMsg: string;
  dialogMsg: string;
  error: boolean;
}
