import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { PasswordComponent } from './components/password.component';

const ROUTES: Routes = [
    {
        path: '',
        component: PasswordComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    exports: [
        RouterModule
    ]
})


export class PasswordRouting { }