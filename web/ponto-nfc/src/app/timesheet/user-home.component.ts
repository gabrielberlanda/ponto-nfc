import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TdDialogService } from '@covalent/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase/app';

import { AuthService } from './../controls/auth.service';

import { Collaborator } from './../entity/collaborator.model';
import { Month } from './../entity/month.model';
import { TimeRecord } from './../entity/timerecord.model';

@Component( {
    moduleId: "module.id",
    selector: 'user-home',
    templateUrl: 'user-home.component.html'
} )

export class UserHomeComponent implements OnInit
{
    private readonly collaboratorsTableName = "collaborators";

    private readonly timesheetTableName = "timesheet"; 

    private loggedUser: User;

    private collaboratorTimeSheet: Array<any>;

    private readonly months = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
    ];

    private monthsWithRecord: Array<Month> = []; 

    private selectedMonth: Month;

    private monthRecordsByDay: Array<{dia:number, timeRecords: Array<TimeRecord>}>;

    private collaborator: Collaborator;

    private biggerMonths = [1, 3, 5, 7, 8, 10, 12];

    constructor(
        private afAuth: AngularFireAuth,
        private afDatabase: AngularFireDatabase,
        private router: Router,
        private authService: AuthService,
        private dialogService: TdDialogService
    ) { }

    ngOnInit()
    {
        this.afAuth.auth.onAuthStateChanged(( loggedUser ) =>
        {
            if ( loggedUser == null || loggedUser == undefined )
            {
                this.router.navigate( ["/authentication"] );
            }
            else
            {
                this.authService.setLoggedUser( loggedUser );
                this.loggedUser = this.authService.getLoggedUser();
                this.initializeColaborator();
            }
        } );
    }

    private initializeColaborator(): void
    {
        this.afDatabase.list( this.collaboratorsTableName, {
            query: {
                orderByChild: "email",
                equalTo: this.loggedUser.email
            }
        } ).subscribe(( result ) =>
        {
            if ( result != null && result.length > 0 )
            {
                this.collaborator = result[0];
                this.authService.setLoggedCollaborator(this.collaborator);
            }
            else
            {
                alert( "Colaborador não encontrado, por favor faça login novamente!" );
                this.authService.setLoggedUser( null );
                this.router.navigate( ["authentication"] );
            }
        } );
    }

    public editNickname()
    {
        this.dialogService.openPrompt({
            message: 'Esse apelido é exibido na sua saudação',
            disableClose: false,
            title: 'Apelido', 
            value: this.collaborator.nickname,
            cancelButton: 'Cancelar', 
            acceptButton: 'Ok', 
        }).afterClosed().subscribe( ( newNickName: string ) => {
            if ( newNickName ) {
                this.collaborator.nickname = newNickName;

                this.afDatabase.object(this.collaboratorsTableName + "/" + this.collaborator.$key)
                .update(this.collaborator);
            }
        });
        }
}