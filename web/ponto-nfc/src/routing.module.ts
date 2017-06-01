import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './app/auth/auth.component';
import { HomeComponent } from './app/home/home.component';
import { AdminComponent } from './app/admin/admin.component';
import { TimesheetComponent } from './app/timesheet/timesheet.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        //implementar o canActivate
        children: [
            {
                path: '',
                redirectTo: 'timesheet',
                pathMatch: 'full'
            },
            {
                path: 'timesheet',
                component: TimesheetComponent
            },
            {
                path: 'admin',
                component: AdminComponent
            }
        ]
    },
    {
        path: 'authentication',
        component: AuthComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot( routes, { useHash: true } );

/**
 *
 */
@NgModule( {
    imports: [
        routing
    ],
    exports: [
        RouterModule
    ]
} )
export class RoutingModule
{
}

export const appRoutingProviders: any[] = [];