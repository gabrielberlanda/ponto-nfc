import { Router } from '@angular/router';
import { AuthService } from './../../controls/auth.service';
import { TimeRecord } from './../../entity/timerecord.model';
import { Month } from './../../entity/month.model';
import { User } from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

@Component( {
    selector: 'timesheet',
    templateUrl: 'timesheet.component.html',
    styleUrls: ['timesheet.component.css']
} )

export class TimesheetComponent implements OnInit
{
    @Input("collaborator") collaborator;

    @Input("admin") admin: boolean;

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

    private biggerMonths = [1, 3, 5, 7, 8, 10, 12];

    constructor(
        private afDatabase: AngularFireDatabase,
        private authService: AuthService,
        private router: Router,
        private snackbar: MdSnackBar,
        @Inject(MD_DIALOG_DATA) data: any
    ) 
    { 
        if(data != null && data.collaborator != null)
        {
            this.collaborator = data.collaborator;
            this.admin = true;
        }
    }

    ngOnInit() 
    {
        this.initializeColaboratorTimeSheet();
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
            
            if(this.biggerMonths.indexOf(+this.selectedMonth.code + 1) != -1 )
            {
                finalDate.setDate(31);
            }
            else
            {
                finalDate.setDate(30);
            }

            finalDate.setDate(30);
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

    saveTimeRecord(timerecord, input)
    {
        let value = input.value;

        if(value.indexOf(":") == -1)
        {
            this.snackbar.open("Por favor preencha no seguinte formato HH:mm ", null, {duration: 2000});
            return;
        }

        if( isNaN( value.split(":")[0] ) || isNaN( value.split(":")[1] ) )
        {
            this.snackbar.open("Horário inválido1231", null, {duration: 2000});
            return;
        }

        let hour = +value.split(":")[0];
        let minute = +value.split(":")[1];

        timerecord.date.setHours(hour);
        timerecord.date.setMinutes(minute);

        if ( Object.prototype.toString.call(timerecord.date) === "[object Date]" ) 
        {
            // it is a date
            if ( isNaN( timerecord.date.getTime() ) ) 
            {  
                //date is not valid
                this.snackbar.open("Horário inválido1231", null, {duration: 2000});
                return
            }
            else 
            {
                // date is valid
                this.afDatabase.object("/timesheet/"+this.collaborator.$key+"/"+timerecord.$key)
                .set({date: timerecord.date.getTime()})
                .then( () => {
                    this.snackbar.open("Registro alterado com sucesso", null, {duration: 2000});
                });
            }
        }
        else 
        {
            this.snackbar.open("Horário inválido", null, {duration: 2000});
            return
        }
    }

}