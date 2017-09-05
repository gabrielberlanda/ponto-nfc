import { Collaborator } from './../../model/collaborator';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-collaborator-form',
    templateUrl: 'collaborator-form.html',
})
export class CollaboratorFormPage {

    /**
     * 
     */
     public collaborator: Collaborator;

    /**
     * 
     */
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public view: ViewController
    ) 
    {
        this.collaborator = new Collaborator();
    }

    /**
     * 
     */
    ionViewDidLoad() 
    {
    }

    /**
     * 
     */
    close() 
    {
        this.view.dismiss();
    }

}
