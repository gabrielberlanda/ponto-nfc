import { TimeRecord } from './timerecord.model';

export class Month
{
    public code: number;
    
    public name: string;

    public year: number;

    public timeRecords: Array<TimeRecord>;

    constructor(code: number, name: string, year: number)
    {
        this.code = code;
        this.name = name;
        this.year = year;
        this.timeRecords = [];
    }
}