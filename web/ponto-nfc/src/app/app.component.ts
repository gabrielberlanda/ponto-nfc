import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AuthService } from './controls/auth.service';

@Component( {
    selector: 'app-root',
    templateUrl: 'app.component.html',
} )
export class AppComponent
{
    constructor( 
        private afAuth: AngularFireAuth, 
        private router: Router,
        private authService: AuthService
    ) {
        afAuth.auth.onAuthStateChanged( ( loggedUser ) => {
            if( loggedUser != null )
            {
                router.navigate(["home"]);
            }
            else
            {
                router.navigate(["authentication"]);
            }
        } );
    }

}