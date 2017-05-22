import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController,
        private nfc: NFC,
        private ndef: Ndef,
        private toast: ToastController,
        private platform: Platform
    ) {
        this.platform.ready()
            .then(() => this.addNfcListeners());
    }


    /**
     * 
     */
    addNfcListeners(): void {
        this.nfc.addTagDiscoveredListener(
            (tagEvent: Event) => console.log(tagEvent)
        ).subscribe((data) => {
            this.tagListenerSuccess(data);
        });

    }

    /**
     * 
     */
    tagListenerSuccess(tagEvent: any) {
        let tagId = this.nfc.bytesToHexString(tagEvent.tag.id);
        this.toast.create((
            {
                message: tagId,
                duration: 3000
            }
        )).present();
        console.log("Caraio é nois cuzao ", tagEvent);
    }


}
