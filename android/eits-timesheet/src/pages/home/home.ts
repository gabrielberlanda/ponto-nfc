import { Network } from '@ionic-native/network';
import { TimeRecord } from './../../model/time-record';
import { Collaborator } from './../../model/collaborator';
import { Component } from '@angular/core';
import { NavController, Platform, ToastController, AlertController } from 'ionic-angular';
import { Ndef, NFC } from '@ionic-native/nfc';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { DatePipe } from '@angular/common';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public nfcOn: boolean = false;
    public networkOn: boolean = true;
    public networkType: string = '';
    private addTagListenerSubstribe: any;

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
        private alertCtrl: AlertController,
        private tts: TextToSpeech,
        private network: Network,
        private navController: NavController
    ) 
    {

        this.navController.viewWillLeave.subscribe( () => {
            if ( this.addTagListenerSubstribe ) this.addTagListenerSubstribe.unsubscribe();
            console.log( "CAIU AQUI");
        })
        
        this.platform.ready()
            .then( () => {
                this.checkNfc();
            });


        //  Evento de disconexão da internet
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            this.networkOn = false;
            console.log( 'desconectado' );
        });

        // watch network for a connection
        let connectSubscription = this.network.onConnect().subscribe(() => {
            
            this.networkOn = true;

            setTimeout(() => {

                if ( this.network.type === 'wifi' || 
                    this.network.type === '3g' || 
                    this.network.type === 'ethernet' || 
                    this.network.type === '4g')
                {
                    this.networkType = this.network.type;
                    console.log( 'tipo: ', this.network.type );
                    console.log( 'net:', this.networkOn );
                }
            }, 3000);
        });
    }

    /**
     * 
     */
     public checkNfc():void 
     {
        this.nfc.enabled()
            .then( () => {
                this.nfcOn = true;
                console.log( "status do nfc:", this.nfcOn )
                this.addNFCListeners();
            })
            .catch( err => {
                this.nfcOn = false;
                console.log( "status do nfc:", this.nfcOn )
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
    }

    /**
     * Evento de nova tag lida.
     */
    private onNewTagDiscovered( tag: any ): void
    {
        const tagCode = this.nfc.bytesToHexString( tag.id );

        Collaborator.findByTagCode( tagCode )
            .then( ( collaborator ) => {
                const now: Date = new Date();
                const timeRecord: TimeRecord = new TimeRecord( now.getTime() ) ;

                timeRecord.insert("timesheet/" + collaborator.$key + "/")
                    .then( ( data ) => {
                        const datePipe = new DatePipe( 'pt-BR' );

                        let timeRecordSuccessAlert = this.alertCtrl.create({
                            title: 'Horário Registrado!',
                            message: 'Colaborador: ' + collaborator.name + '\n Horário: ' + datePipe.transform( now, 'jms') ,
                            buttons: ['É nois']
                        }).present();

                        this.tts.speak({
                            text: 'Olá, ' + collaborator.nickname,
                            locale: 'pt-BR'
                        });

                    })
                    .catch( err => console.error( err ) );
                    
            })
            .catch( err => {
                this.toastCtrl.create({ 
                    message: 'Colaborador não encontrado.',
                    duration: 3000,
                    closeButtonText: 'Ok'
                }).present();
                this.tts.speak({ 
                    text: 'Ops, não encontramos ninguém registrado com sua TAG',
                    locale: 'pt-BR'
                });
            });
    }

    
}
