import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'fc-auth-dialog',
  templateUrl: './auth.dialog.html',
  styleUrls: ['./auth.dialog.css']
})
export class AuthDialogComponent {

  constructor(private dialogRef: MatDialogRef<AuthDialogComponent>) {}

  loginSuccess() {
    this.dialogRef.close();
  }
}
