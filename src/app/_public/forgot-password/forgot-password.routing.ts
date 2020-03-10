
import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { ForgotPasswordComponent } from './components/forgot-password.component';

const ROUTES: Routes = [
    {
        path: '',
        component: ForgotPasswordComponent
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


export class ForgotPasswordRouting { }
