import { Collaborator } from './../entity/collaborator.model';
import { Injectable } from '@angular/core';

import { User } from 'firebase/app';

@Injectable()
export class AuthService {

    private loggedUser: User;

    private loggedCollaborator: Collaborator;

    constructor() { }

    public setLoggedUser( loggedUser: User ): void
    {
        this.loggedUser = loggedUser;
    }

    public getLoggedUser(): User
    {
        return this.loggedUser;
    }

    public setLoggedCollaborator( collaborator: Collaborator)
    {
        this.loggedCollaborator = collaborator;
    }

    public getLoggedCollaborator()
    {
        return this.loggedCollaborator;
    }
}