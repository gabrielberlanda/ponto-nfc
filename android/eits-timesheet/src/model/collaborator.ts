import { Entity } from './entity';

/**
 * 
 */
export class Collaborator extends Entity {
    
    /**
     * 
     */
    public name:string;

    /**
     * 
     */
    public admin:boolean;

    /**
     * 
     */
    public tagCode:string;

    /**
     * 
     */
    public nickname:string;

    /**
     * 
     */
    public email:string;


    constructor()
    {
        super();
    }
    /**
     * 
     */
    static findByTagCode( tagCode: string ): Promise<Collaborator>
    {
        const promise: Promise<Collaborator> = new Promise<Collaborator>( ( resolve, reject ) => {
            Collaborator.list({
                query: {
                    orderByChild: 'tagCode',
                    equalTo: tagCode,
                },
            }, "collaborators"
            ).subscribe( ( result ) => {
                if ( result && result.length )
                {
                    const collaboratorFound = new Collaborator().fromJSON( result[0] );
                    collaboratorFound.$key = result[0].$key;
                    resolve( collaboratorFound );
                }
                else
                {
                    reject( 'Usuário não encontrado' );
                }
            })
        });

        return promise;
    }
}