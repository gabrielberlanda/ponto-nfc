import { Collaborator } from './../entity/collaborator.model';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AuthService } from './../controls/auth.service';

@Component( {
    selector: "auth-component",
    templateUrl: "auth.component.html"
} )
export class AuthComponent
{
    constructor(
        private afAuth: AngularFireAuth,
        private snackbar: MdSnackBar,
        private router: Router,
        private authService: AuthService
    ) { }

    login()
    {
        this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider() )
            .then(( result ) =>
            {
                if ( result.user.email.split( "@" )[1] != "eits.com.br" )
                {
                    alert( "Você deve utilizar uma conta do domínio eits.com.br");
                    this.afAuth.auth.signOut();
                }
                else
                {
                    this.authService.setLoggedUser( result );

                    this.router.navigate( ["home"] );
                }
            } )
            .catch(( exception ) =>
            {
                console.log( exception );
            } );
    }

}