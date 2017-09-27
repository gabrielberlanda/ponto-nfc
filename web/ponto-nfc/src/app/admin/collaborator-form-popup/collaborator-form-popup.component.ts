import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component( {
    selector: 'collaborator-form-popup',
    templateUrl: 'collaborator-form-popup.component.html'
} )

export class CollaboratorFormPopupComponent implements OnInit
{
    public collaborator: 
    {
        $key: string,
        name: string,
        email: string,
        tagCode: string,
        admin: boolean,
        nickname: string,
        active: boolean
    } = 
    {
        $key: null,
        name: null,
        email: null,
        tagCode: null,
        admin: false,
        nickname: null,
        active: true
    };

    constructor(
        private afDatabase: AngularFireDatabase,
        private mdDialogRef: MdDialogRef<CollaboratorFormPopupComponent>
    ) { }

    ngOnInit() { }

    save()
    {
        if(this.collaborator.$key != null)
        {
            this.updateCollaborator();
        }
        else
        {
            this.saveCollaborator();
        }
        
    }

    updateCollaborator()
    {
        if(this.collaborator.name != null && this.collaborator.email != null)
        {
            this.afDatabase.object("collaborators/"+this.collaborator.$key)
            .set(this.collaborator);
        }

        this.mdDialogRef.close();
    }

    saveCollaborator()
    {
        if(this.collaborator.name != null && this.collaborator.email != null)
        {
            this.collaborator.nickname = this.collaborator.name.split(" ")[0];
            this.collaborator.active = true;

            this.afDatabase.list("collaborators")
            .push(this.collaborator);
        }

        this.mdDialogRef.close();
    }

    close()
    {
        this.mdDialogRef.close();
    }
}