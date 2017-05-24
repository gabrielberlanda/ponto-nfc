import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

/**
 * 
 */
export abstract class Entity 
{
    public $key: any;
    public $value: any;

    protected static $entityName: string;

    protected static db:AngularFireDatabase;

    /**
     * 
     */
    constructor() {
        Entity.db = window["angularFireDatabase"];
        Entity.$entityName = this.constructor.name;
    }
    
    /**
     * 
     */
    public insert():firebase.Promise<void> {
        const entities = Entity.db.list(Entity.$entityName);
        return entities.push(this);
    }
    
    /**
     * 
     */
    public update():firebase.Promise<void> {
        const entities = Entity.db.list(Entity.$entityName);
        return entities.update(this.$key, this);
    }
    
    /**
     * 
     */
    public remove():firebase.Promise<void> {
        const entities = Entity.db.list(Entity.$entityName);
        return entities.remove(this.$key);
    }
    
    /**
     * 
     */
    public static list( query:{[key: string]: any;
                            orderByKey?: boolean,
                            orderByPriority?: boolean,
                            orderByChild?: string,
                            orderByValue?: boolean,
                            equalTo?: any,
                            startAt?: any,
                            endAt?: any,
                            limitToFirst?: number,
                            limitToLast?: number
                         } ):FirebaseListObservable<any[]> {

        if ( !Entity.db ) Entity.db = window["angularFireDatabase"];
        
        return Entity.db.list(this.name, query);
    }

}