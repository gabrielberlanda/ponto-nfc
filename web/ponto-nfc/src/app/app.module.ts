import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { 
    MdInputModule, 
    MdButtonModule, 
    MdIconModule, 
    MdListModule, 
    MdCardModule, 
    MdCoreModule, 
    MdMenuModule, 
    MdSidenavModule, 
    MdSnackBarModule, 
    MdSelectModule, 
    MdToolbarModule ,
    MdSlideToggleModule,
    MD_DIALOG_DATA
} from '@angular/material';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { 
    CovalentLayoutModule, 
    CovalentMessageModule, 
    CovalentExpansionPanelModule, 
    CovalentDialogsModule,
    CovalentDataTableModule
} from '@covalent/core';

import { RoutingModule, appRoutingProviders } from './../routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserHomeComponent } from './timesheet/user-home.component';
import { TimesheetComponent } from './timesheet/timesheet/timesheet.component';
import { CollaboratorFormPopupComponent } from './admin/collaborator-form-popup/collaborator-form-popup.component';

import { AuthService } from './controls/auth.service';

export const firebaseConfig = {
    apiKey: "AIzaSyBOo-2ohlbq_CO0lSeSO3mZkqv16Emp0PE",
    authDomain: "ponto-nfc.firebaseapp.com",
    databaseURL: "https://ponto-nfc.firebaseio.com",
    projectId: "ponto-nfc",
    storageBucket: "ponto-nfc.appspot.com",
    messagingSenderId: "81659961924"
};

@NgModule( {
    declarations: [
        AdminComponent,
        AppComponent,
        AuthComponent,
        HomeComponent,
        UserHomeComponent,
        CollaboratorFormPopupComponent,
        TimesheetComponent
    ],
    imports: [
        AngularFireModule.initializeApp( firebaseConfig ),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        BrowserModule,
        BrowserAnimationsModule,
        CovalentDataTableModule,
        CovalentDialogsModule,
        CovalentExpansionPanelModule,
        CovalentLayoutModule,
        CovalentMessageModule,
        FormsModule,
        HttpModule,
        MdButtonModule,
        MdCardModule,
        MdCoreModule,
        MdIconModule,
        MdInputModule,
        MdListModule,
        MdMenuModule,
        MdSidenavModule,
        MdSnackBarModule,
        MdSelectModule,
        MdToolbarModule,
        MdSlideToggleModule,
        RoutingModule
    ],
    providers: [
        appRoutingProviders,
        AuthService,
        {provide: MD_DIALOG_DATA, useValue: {} }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        CollaboratorFormPopupComponent,
        TimesheetComponent
    ]
} )
export class AppModule { }
