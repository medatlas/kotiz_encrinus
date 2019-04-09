import { SignDialogComponent } from './ui/sign.dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './service/auth.guard';
import { AuthDialogComponent } from './ui/auth.dialog';
import { DropZoneDirective } from './drop-zone.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { FileSizePipe } from './file-size.pipe';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { MaterialModule } from './material.module';
import { DocumentListComponent } from './ui/document.list';
import { DocumentService } from './service/document.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as Hammer from 'hammerjs';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    // override hammerjs default configuration
    swipe: { direction: Hammer.DIRECTION_ALL }
  };
}

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
  ],
  tosUrl: 'http://localhost:4200'
};

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    FileSizePipe,
    DropZoneDirective,
    AuthDialogComponent,
    DocumentListComponent,
    SignDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [
    DocumentService,
    AuthGuard,
    HttpClient,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}
  ],
  bootstrap: [AppComponent],
  entryComponents: [DocumentListComponent, AuthDialogComponent, SignDialogComponent]
})
export class AppModule { }
