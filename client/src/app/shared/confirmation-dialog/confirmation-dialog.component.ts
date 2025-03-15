import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
  imports: [
    MatDialogModule,
    MatButtonModule,
  ]
})
export class ConfirmationDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.statement = data.message
    this.confirm_action = data.confirmMessage ? data.confirmMessage : this.confirm_action;
    this.deny_action = data.denyMessage ? data.denyMessage : this.deny_action;
  }

  statement: string = "accept this user?"
  confirm_action: string = "confirm"
  deny_action: string = "cancel"
}
