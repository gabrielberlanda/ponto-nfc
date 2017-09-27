import { AngularFireDatabase } from 'angularfire2/database';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Collaborator } from './../../model/collaborator';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-collaborator-update-nfc',
    templateUrl: 'collaborator-update-nfc.html',
})
export class CollaboratorUpdateNfcPage {

    public collaborator: Collaborator;
    private addTagListenerSubstribe: any;
    public tagFound: string  = null;

    constructor( public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public nfc: NFC, public ndef: Ndef, public toastCtrl: ToastController) 
    {
        let collaboratorParam = navParams.get("collaborator");
        
        this.collaborator = new Collaborator().fromJSON( collaboratorParam );
        this.collaborator.$key = collaboratorParam.$key;

        console.log( this.collaborator );

        //Ativando o listener de NFC
        this.addTagListenerSubstribe = this.nfc.addTagDiscoveredListener(
            ( tagEvent: Event ) => { console.log( 'Evento de NFC adicionado' ) },
            ( tagEvent: Event ) => { console.error( 'Falha ao adicionar o listener de NFC', tagEvent ) } 
        ).subscribe( ( nfcRead ) => {
            //Tag lida.
            if ( nfcRead && nfcRead.tag )
            {
                this.onNewTagDiscovered( nfcRead.tag );
            }
        })

        //Desativando o listener ao sair da pagina
        this.navCtrl.viewWillLeave.subscribe( () => {
            if ( this.addTagListenerSubstribe ) this.addTagListenerSubstribe.unsubscribe();
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CollaboratorUpdateNfcPage');
    }

    onNewTagDiscovered( tag ) {
        this.tagFound = this.nfc.bytesToHexString( tag.id );

        console.log( 'A tag descoberta foi: ' + tag );
    }

    onUpdateCollaboratorNfc() {
        this.collaborator.tagCode = this.tagFound;

        let db: AngularFireDatabase = window["angularFireDatabase"];
        
        let collaboratorUpdate = db.object("collaborators/"+ this.collaborator.$key);

        collaboratorUpdate.update({ tagCode : this.tagFound })
            .then( ( data ) => {
                console.log( data );
                this.toastCtrl.create({
                    message: 'NFC vinculado com sucesso.',
                    duration: 3000
                }).present();
                this.viewCtrl.dismiss();
            })
            .catch( ( err ) => {
                console.log( err );
                this.toastCtrl.create({ 
                    message: 'Ocorreu um erro ao tentar vincular o NFC do colaborador.',
                    duration: 3000
                });
            });

    
        console.log( collaboratorUpdate );
    }

    /**
     * 
     */
    onCancel() 
    {
       this.viewCtrl.dismiss(); 
    }
}
