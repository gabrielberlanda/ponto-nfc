import { TimeRecord } from './../../model/time-record';
import { Collaborator } from './../../model/collaborator';
import { Component } from '@angular/core';
import { NavController, Platform, ToastController, AlertController } from 'ionic-angular';
import { Ndef, NFC } from '@ionic-native/nfc';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    /**
     * 
     */
    constructor(
        public navCtrl: NavController,
        private db: AngularFireDatabase,
        private nfc: NFC,
        private ndef: Ndef,
        private platform: Platform,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController
    ) 
    {
        this.platform.ready()
            .then( () => {
                this.checkNfc();
            })
    }

    /**
     * 
     */
     private checkNfc():void 
     {
        this.nfc.enabled()
            .then( () => {
                this.addNFCListeners();
                this.toastCtrl.create({
                    message: 'Listener de NFC adicionado.',
                    duration: 3000
                }).present();
            })
            .catch( err => {
                const alert = this.alertCtrl.create({
                    title: 'NFC desligado',
                    subTitle: 'Verifique o status do seu leitor de NFC',
                    buttons: [
                        { 
                            text: 'Ok' 
                        }, 
                        {
                            text: 'Configurações',
                            handler: () => {
                                this.nfc.showSettings();
                            }
                        }]
                });
                alert.present();
            });
     }

    /**
     * 
     */
    private addNFCListeners():void
    {
        this.nfc.addTagDiscoveredListener(
            ( tagEvent: Event ) => { console.log( 'Evento de NFC adicionado' ) },
            ( tagEvent: Event ) => { console.error( 'Falha ao adicionar o listener de NFC', tagEvent ) } 
        ).subscribe( ( nfcRead ) => {
            //Tag lida.
            if ( nfcRead && nfcRead.tag )
            {
                console.log( 'Tag lida: ', nfcRead );
                this.onNewTagDiscovered( nfcRead.tag );
            }
        })
    }

    /**
     * Evento de nova tag lida.
     */
    private onNewTagDiscovered( tag: any ): void
    {
        const tagCode = this.nfc.bytesToHexString( tag.id );

        Collaborator.findByTagCode( tagCode )
            .then( ( collaborator ) => {
                const timeRecord: TimeRecord = new TimeRecord( new Date().getTime() ) ;

                timeRecord.insert("timesheet/" + collaborator.$key + "/")
                    .then( ( data ) => {
                        this.toastCtrl.create({
                            message: 'Olá, '+ collaborator.nickname,
                            duration: 3000,
                            closeButtonText: 'Ok'
                        }).present();
                    })
                    .catch( err => console.error( err ) );
            })
            .catch( err => {
                this.toastCtrl.create({ 
                    message: 'Colaborador não encontrado.',
                    duration: 3000,
                    closeButtonText: 'Ok'
                }).present();
            });
    }

    
}
