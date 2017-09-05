import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollaboratorFormPage } from './collaborator-form';

@NgModule({
  declarations: [
    CollaboratorFormPage,
  ],
  imports: [
    IonicPageModule.forChild(CollaboratorFormPage),
  ],
  exports: [
    CollaboratorFormPage
  ]
})
export class CollaboratorFormPageModule {}
