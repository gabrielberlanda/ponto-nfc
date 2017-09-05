import { CollaboratorFormPage } from './../collaborator-form/collaborator-form';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Collaborator } from './../../model/collaborator';
import { FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-collaborator-list',
    templateUrl: 'collaborator-list.html',
})
export class CollaboratorListPage {

    /**
     * 
     */
    private collaborators: FirebaseListObservable<any[]>;
    private nfcListener: any;

    /**
     * 
     */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private nfc: NFC,
        private ndef: Ndef,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
    ) 
    {
        this.collaborators = Collaborator.list({ limitToLast: 50}, "collaborators");
    }

    /**
     * 
     */
    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad CollaboratorListPage');
    }

    ionViewWillLeave()
    {
        if ( this.nfcListener ) this.nfcListener.unsubscribe();
        console.log( 'Saiu da pagina de listagem de colaborador' );
    }

    // /**
    //  * 
    //  */
    // onNewCollaborator() 
    // {
    //     this.nfc.enabled()
    //         .then( () => {
    //             this.alertCtrl
    //                 .create({
    //                     title : 'Ler código',
    //                     message: 'Precisamos verificar suas permissões',
    //                     buttons: [
    //                         {
    //                             text: 'Cancelar',
    //                             role: 'cancel',
    //                             handler: () => {
    //                                 if ( this.nfcListener ) this.nfcListener.unsubscribe();
    //                             }
    //                         }
    //                     ]
    //                 })
    //                 .present()
    //                 .then( () => {
    //                     this.nfcListener = this.nfc.addTagDiscoveredListener()
    //                         .subscribe( ( nfcReadEvent ) => {
    //                             this.onCheckCollaboratorPermission( nfcReadEvent.tag );
    //                         })
    //                 })
    //         })
    //         .catch( (err) => this.toastCtrl.create( { message : 'NFC está desativado', duration : 3000, showCloseButton: true } ).present() )
    // }

    // /**
    //  * 
    //  */
    // onCheckCollaboratorPermission( tag ) : void 
    // {
    //     Collaborator.findByTagCode( tag.id )
    //         .then( ( collaboratorFound ) => {
    //             if ( collaboratorFound.admin )
    //             {
    //                 let collaboratorFormModal = this.modalCtrl.create( CollaboratorFormPage );
    //                 collaboratorFormModal.present();
    //             }
    //             else 
    //             {
    //                 this.toastCtrl.create( 
    //                     { 
    //                         message : 'Somente administrador pode adicionar colaborador.', 
    //                         duration : 3000, 
    //                         showCloseButton: true 
    //                 }).present();
                    
    //             }   
    //         })
    //         .catch( (err) => this.toastCtrl.create( { message : 'Colaborador não encontrado', duration : 3000, showCloseButton: true } ).present() );
    //         this.nfcListener.unsubscribe();
    // }

    /**
     * 
     */
    onNewCollaborator()
    {
        let collaboratorFormModal = this.modalCtrl.create( CollaboratorFormPage );
        collaboratorFormModal.present();
    }
}
