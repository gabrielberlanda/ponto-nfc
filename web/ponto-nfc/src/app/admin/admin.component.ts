import { CollaboratorFormPopupComponent } from './collaborator-form-popup/collaborator-form-popup.component';
import { Collaborator } from './../entity/collaborator.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

@Component({
    moduleId: "module.id",
    selector: 'admin-component',
    templateUrl: 'admin.component.html'
})

export class AdminComponent implements OnInit {
    private collaborators: Array<Collaborator> = [];
    constructor(
        private afDatabase: AngularFireDatabase,
        private dialog: MdDialog
    ) { }

    ngOnInit() 
    { 
        this.afDatabase.list("collaborators")
        .subscribe( ( result ) => {
            this.collaborators = result;  
        });
    }

    openColaboratorForm()
    {
        let dialog = this.dialog.open(CollaboratorFormPopupComponent ,{
            width: "50%"
        });
    }

    editCollaborator(collaborator)
    {
        let dialog = this.dialog.open(CollaboratorFormPopupComponent ,{
            width: "50%"
        });

        dialog.componentInstance.collaborator = collaborator;
    }

    deactivateCollaborator(collaborator)
    {
        collaborator.active = false;

        this.afDatabase.object("collaborators/"+collaborator.$key)
        .set(collaborator);
    }

    collaboratorTimesheet(collaborator)
    {
        
    }

}