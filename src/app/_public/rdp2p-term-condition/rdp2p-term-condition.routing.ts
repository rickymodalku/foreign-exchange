import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { Rdp2pTermConditionComponent } from './components/rdp2p-term-condition.component';

const ROUTES: Routes = [
    {
        path: '',
        component: Rdp2pTermConditionComponent
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


export class Rdp2pTermConditionRouting { }
