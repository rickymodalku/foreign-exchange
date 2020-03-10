import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { CareerComponent } from './components/career.component';

const ROUTES: Routes = [
    {
        path: '',
        component: CareerComponent
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


export class CareerRouting { }