
import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { SignUpComponent } from './components/sign-up.component';

const ROUTES: Routes = [
    {
        path: '',
        component: SignUpComponent
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


export class SignUpRouting { }
