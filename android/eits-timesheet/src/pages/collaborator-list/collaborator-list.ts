import { CollaboratorUpdateNfcPage } from './../collaborator-update-nfc/collaborator-update-nfc';
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
        console.log( 'Saiu da pagina de listagem de colaborador' );
    }

    /**
     * 
     * @param collaborator 
     */
    onUpdateCollaboratorNfc( collaborator )
    {
        console.log('Vamos atualizar o ' + collaborator.name )
        let modal = this.modalCtrl.create( CollaboratorUpdateNfcPage, { collaborator: collaborator } );
        
        modal.present();
    }

}
