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
    selector: 'timesheet-component',
    templateUrl: 'timesheet.component.html'
} )

export class TimesheetComponent implements OnInit
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
                this.initializeColaboratorTimeSheet();
            }
            else
            {
                alert( "Colaborador não encontrado, por favor faça login novamente!" );
                this.authService.setLoggedUser( null );
                this.router.navigate( ["authentication"] );
            }
        } );
    }

    private initializeColaboratorTimeSheet()
    {
        this.afDatabase.list( this.timesheetTableName +"/"+ this.collaborator.$key, {
            query: {
                orderByChild: "date"
            }
        } )
        .subscribe(( timesheet ) =>
        {
            this.extractMonthsWithRecords(timesheet);
            this.selectedMonth = this.monthsWithRecord[ this.monthsWithRecord.length - 1 ];

            this.listRecordsBySelectedMonth();
        } );
    }

    private extractMonthsWithRecords( timesheet: Array<any> )
    {
        let months: Array<any> = [];
        for(let i = 0; i < timesheet.length; i++)
        {
            var timeRecord = new TimeRecord(timesheet[i].$key, timesheet[i].date);

            if( months.indexOf( timeRecord.date.getMonth()+"-"+timeRecord.date.getFullYear() ) == -1 )
            {
                months.push( timeRecord.date.getMonth()+"-"+timeRecord.date.getFullYear() );
            }
        }

        for(let i = 0; i < months.length; i++)
        {
            let month = months[i].split("-")[0];
            let year = months[i].split("-")[1];

            this.monthsWithRecord.push(new Month(month, this.months[month], year));
        }

    }

    private listRecordsBySelectedMonth()
    {
        if( this.selectedMonth != null )
        {
            let initialDate = new Date();
            initialDate.setDate(1);
            initialDate.setMonth(this.selectedMonth.code);
            initialDate.setFullYear(this.selectedMonth.year);
            initialDate.setHours(0);
            initialDate.setMinutes(0);
            initialDate.setSeconds(0);

            let finalDate = new Date();
            finalDate.setDate(31);
            finalDate.setMonth(this.selectedMonth.code);
            finalDate.setFullYear(this.selectedMonth.year);
            finalDate.setHours(23);
            finalDate.setMinutes(59);
            finalDate.setSeconds(0);

            this.afDatabase.list( this.timesheetTableName +"/"+ this.collaborator.$key, {
                query: {
                    orderByChild: "date",
                    startAt: initialDate.getTime(),
                    endAt: finalDate.getTime()
                }
            } )
            .subscribe( ( monthTimeRecords ) => {
                this.monthRecordsByDay = new Array<{dia:number, timeRecords: Array<TimeRecord>}>();
                
                for( let i = 0; i < monthTimeRecords.length; i++ )
                {
                    var timeRecord = new TimeRecord( monthTimeRecords[i].$key, monthTimeRecords[i].date );
                    
                    if( this.monthRecordsByDay.indexOf( this.monthRecordsByDay.find( ( element ) => element.dia == timeRecord.date.getDate() ) ) == -1 )
                    {
                        this.monthRecordsByDay.push( {dia: timeRecord.date.getDate(), timeRecords: new Array<TimeRecord>()} );
                    }

                    this.monthRecordsByDay.find( ( element ) => element.dia == timeRecord.date.getDate() ).timeRecords.push( timeRecord );
                }

            });
        }
    }

    public formatDate(date: Date)
    {
        return (date.getDate() < 10 ? "0"+date.getDate() : date.getDate() )+"/"
            +((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1))+"/"+date.getFullYear();
    }

    public formatHour(date: Date)
    {
        return ( date.getHours() < 10 ? "0"+date.getHours() : date.getHours() )
            +":"+(date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes())+":"
            +(date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds());
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