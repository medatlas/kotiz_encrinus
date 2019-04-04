import { AuthDialogComponent } from './ui/auth.dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Component({
  selector: 'fc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private zone: NgZone,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.angularFireAuth.authState.subscribe(user => {
      if (!this.angularFireAuth.auth.currentUser) {
        Promise.resolve().then(() => this.dialog.open(AuthDialogComponent));
      } else {
        this.zone.run(() => this.router.navigate(['/docs']));
      }
    });
  }
}
