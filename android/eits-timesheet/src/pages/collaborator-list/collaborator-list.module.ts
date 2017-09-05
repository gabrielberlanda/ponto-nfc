import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollaboratorListPage } from './collaborator-list';

@NgModule({
  declarations: [
    CollaboratorListPage,
  ],
  imports: [
    IonicPageModule.forChild(CollaboratorListPage),
  ],
  exports: [
    CollaboratorListPage
  ]
})
export class CollaboratorListPageModule {}
