import { Serializable } from './serializable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

/**
 * 
 */
export abstract class Entity extends Serializable
{
    public $key: any;
    public $value: any;

    protected static $entityName: string;

    protected static db:AngularFireDatabase;

    /**
     * 
     */
    constructor() {
        super();
        Entity.db = window["angularFireDatabase"];
        Entity.$entityName = this.constructor.name;
    }
    
    /**
     * Path is optional, the default value is the $entityName
     */
    public insert( path = Entity.$entityName ):firebase.Promise<void> {
        const entities = Entity.db.list( path );
        return entities.push(this);
    }
    
    /**
     * Path is optional, the default value is the $entityName
     */
    public update( path = Entity.$entityName  ):firebase.Promise<void> {
        const entities = Entity.db.list( path );
        return entities.update(this.$key, this);
    }
    
    /**
     * Path is optional, the default value is the $entityName
     */
    public remove( path = Entity.$entityName ):firebase.Promise<void> {
        const entities = Entity.db.list( path );
        return entities.remove(this.$key);
    }
    
    /**
     * Path is optional, the default value is the $entityName
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
                         }, path = this.name ):FirebaseListObservable<any[]> {

        if ( !Entity.db ) Entity.db = window["angularFireDatabase"];
        
        return Entity.db.list(path, query);
    }

}