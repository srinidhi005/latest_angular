import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-input-value-dialog',
  templateUrl: 'input-value-dialog.component.html',
})
export class VisualBSInputDialogComponent {
  showError;
  constructor(
    public dialogRef: MatDialogRef<VisualBSInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onOk(): void {
    this.showError = false;
    if (!this.data.value) {
      this.showError = true;
      return;
    }
    if (
      typeof this.data.min !== 'undefined' &&
      this.data.min > this.data.value
    ) {
      this.showError = true;
      return;
    }

    if (
      typeof this.data.max !== 'undefined' &&
      this.data.max < this.data.value
    ) {
      this.showError = true;
      return;
    }
    this.dialogRef.close(this.data.value);
  }
}
