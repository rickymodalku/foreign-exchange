import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { LoyaltyComponent } from './components/loyalty.component';

const ROUTES: Routes = [
    {
        path: '',
        component: LoyaltyComponent
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

export class LoyaltyRouting {}
