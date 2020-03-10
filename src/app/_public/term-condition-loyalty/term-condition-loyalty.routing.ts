import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { TermConditionLoyaltyComponent } from './components/term-condition-loyalty.component';

const ROUTES: Routes = [
    {
        path: '',
        component: TermConditionLoyaltyComponent
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


export class TermConditionLoyaltyRouting { }
