import { Collaborator } from './../entity/collaborator.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: "module.id",
    selector: 'admin-component',
    templateUrl: 'admin.component.html'
})

export class AdminComponent implements OnInit {
    private collaborators: Array<Collaborator> = [];
    constructor(
        private afDatabase: AngularFireDatabase
    ) { }

    ngOnInit() 
    { 
        this.afDatabase.list("collaborators")
        .subscribe( ( result ) => {
            this.collaborators = result;  
        });
    }


}