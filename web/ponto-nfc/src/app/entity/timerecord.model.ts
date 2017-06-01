export class TimeRecord
{
    public $key: string;

    public date: Date;

    constructor($key: string, date: Date)
    {
        this.$key = $key;
        this.date = new Date( date );
    }
}