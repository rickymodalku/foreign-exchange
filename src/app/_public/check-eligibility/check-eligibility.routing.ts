import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { CheckEligibilityComponent } from './components/check-eligibility.component';

const ROUTES: Routes = [
    {
        path: '',
        component: CheckEligibilityComponent
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


export class CheckEligibilityRouting { }
