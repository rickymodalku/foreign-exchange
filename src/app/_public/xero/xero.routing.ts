import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { XeroComponent } from './components/xero.component';

const ROUTES: Routes = [
    {
        path: '',
        component: XeroComponent
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


export class XeroRouting { }
