import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { BorrowerDashboardComponent } from './components/borrower-dashboard.component';

const ROUTES: Routes = [
    {
      path: 'check-eligibility-result',
      component: BorrowerDashboardComponent
    },
    {
      path: 'check-eligibility',
      component: BorrowerDashboardComponent
    },
    {
      path: '',
      component: BorrowerDashboardComponent
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

export class BorrowerDashBoardRouting { }
