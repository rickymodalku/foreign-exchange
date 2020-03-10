import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { ReferralDashboardComponent } from './components/referral-dashboard.component';

const ROUTES: Routes = [
    {
      path: 'sme',
      component: ReferralDashboardComponent
    },
    {
        path: '',
        component: ReferralDashboardComponent
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

export class ReferralDashBoardRouting { }
