import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { InvestorDashboardComponent } from './components/investor-dashboard.component';

const ROUTES: Routes = [
    {
        path: '',
        component: InvestorDashboardComponent
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

export class InvestorDashBoardRouting { }