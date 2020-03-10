import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { VirtualAccountComponent } from './components/virtual-account.component';

const ROUTES: Routes = [
    {
        path: '',
        component: VirtualAccountComponent
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


export class VirtualAccountRouting { }
