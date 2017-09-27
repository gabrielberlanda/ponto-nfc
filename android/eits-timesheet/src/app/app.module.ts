import { CollaboratorUpdateNfcPage } from './../pages/collaborator-update-nfc/collaborator-update-nfc';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NFC, Ndef } from '@ionic-native/nfc';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Network } from '@ionic-native/network';


//AngularFire imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';

//Environment config
import { environment } from '../environments/environment';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CollaboratorListPage } from './../pages/collaborator-list/collaborator-list';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CollaboratorListPage,
    CollaboratorUpdateNfcPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CollaboratorListPage,
    CollaboratorUpdateNfcPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NFC,
    Ndef,
    TextToSpeech,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
    constructor( angularFireDatabase :AngularFireDatabase ) {
        window["angularFireDatabase"] = angularFireDatabase;
    }
}
