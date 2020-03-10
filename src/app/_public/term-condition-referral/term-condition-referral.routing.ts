
import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { TermConditionReferralComponent } from './components/term-condition-referral.component';

const ROUTES: Routes = [
    {
        path: '',
        component: TermConditionReferralComponent
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


export class TermConditionReferralRouting { }