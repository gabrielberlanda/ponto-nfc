import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollaboratorUpdateNfcPage } from './collaborator-update-nfc';

@NgModule({
  declarations: [
    CollaboratorUpdateNfcPage,
  ],
  imports: [
    IonicPageModule.forChild(CollaboratorUpdateNfcPage),
  ],
  exports: [
    CollaboratorUpdateNfcPage
  ]
})
export class CollaboratorUpdateNfcPageModule {}
