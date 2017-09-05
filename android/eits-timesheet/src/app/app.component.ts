import { CollaboratorListPage } from './../pages/collaborator-list/collaborator-list';
import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    rootPage: any = HomePage;

    pages: Array<{ title: string, component: any }> = [];

    constructor(
        platform: Platform, 
        statusBar: StatusBar, 
        splashScreen: SplashScreen,
        private menuController: MenuController
    ) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });

        this.pages = [
            { title: 'Registro de Horário', component: HomePage },
            { title: 'Colaboradores', component: CollaboratorListPage }
        ];
    }

    openPage( page: { title: string, component: any } ) :void {
        this.rootPage = page.component;
        this.menuController.close();
    }
}

