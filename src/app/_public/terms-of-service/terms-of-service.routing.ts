import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { TermsOfServiceComponent } from './components/terms-of-service.component';

const ROUTES: Routes = [
    {
        path: '',
        component: TermsOfServiceComponent
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


export class TermsOfServiceRouting { }