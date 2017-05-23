import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    /**
     * 
     */
    contributors: FirebaseListObservable<any[]>;

    /**
     * 
     */
    constructor(
        public navCtrl: NavController,
        private db: AngularFireDatabase
    ) {
        this.contributors = db.list("/contributors")
    }

}
