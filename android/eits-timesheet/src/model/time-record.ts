import { Entity } from './entity';

/**
 * 
 */
export class TimeRecord extends Entity {
    
    /**
     * 
     */
    public date: number;

    /**
     * 
     */
    constructor( date : number ) 
    {
        super();
        this.date = date;
    }
}