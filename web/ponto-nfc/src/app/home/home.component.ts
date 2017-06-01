import { AuthService } from './../controls/auth.service';
import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

@Component( {
    moduleId: "module.id",
    selector: 'home-component',
    templateUrl: 'home.component.html'
} )

export class HomeComponent implements OnInit
{
    constructor(
        private afAuth: AngularFireAuth,
        private authService: AuthService
    ) { }

    ngOnInit() { }

    logout()
    {
        this.afAuth.auth.signOut();
    }

    public isAdminCollaborator()
    {
        if( this.authService.getLoggedCollaborator() != undefined && this.authService.getLoggedCollaborator().admin )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}